import requests
import pandas as pd
import os
import re
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

# Function to get the status of an issue from GitHub Projects (GraphQL)
def get_issue_status(repo_owner, repo_name, issue_number, github_token):
    url = "https://api.github.com/graphql"
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    query = """
    query($owner: String!, $repo: String!, $issueNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $issueNumber) {
          projectItems(first: 50) {
            nodes {
              fieldValueByName(name: "Status") {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                }
              }
            }
          }
        }
      }
    }
    """
    
    variables = {
        "owner": repo_owner,
        "repo": repo_name,
        "issueNumber": int(issue_number)
    }
    
    response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
    
    print("GitHub GraphQL Response:", response.json()) 
    
    if response.status_code == 200:
        data = response.json()
        try:
            status = data["data"]["repository"]["issue"]["projectItems"]["nodes"][0]["fieldValueByName"]["name"]
            return status if status else "No Status"
        except (IndexError, TypeError, KeyError):
            return "Unknown"
    else:
        print(f"Error fetching issue status: {response.status_code} - {response.text}")
        return "Error"

# Function to get the files from specific Figma projects
def get_figma_project_files(project_ids, figma_token):
    headers = {
        "X-Figma-Token": figma_token
    }
    file_keys = []
    
    for project_id in project_ids:
        print(f"Fetching files for project ID: {project_id}")
        project_files_url = f"https://api.figma.com/v1/projects/{project_id}/files"
        files_response = requests.get(project_files_url, headers=headers)
        
        if files_response.status_code == 200:
            files = files_response.json().get("files", [])
            for file in files:
                file_keys.append({"key": file["key"], "name": file["name"]})
        else:
            print(f"Error fetching files for project {project_id}: {files_response.status_code}")
    
    return file_keys

# Function to get information from a Figma file, using the branch_data=true parameter
def get_figma_file_data(file_key, figma_token):
    headers = {
        "X-Figma-Token": figma_token
    }
    url = f"https://api.figma.com/v1/files/{file_key}?branch_data=true"
    response = requests.get(url, headers=headers, verify=True)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching data for file {file_key}: {response.status_code}")
        return None

# Function to format the time difference into years, months, and days
def format_time_difference(days):
    years = days // 365
    remaining_days = days % 365
    months = remaining_days // 30
    remaining_days = remaining_days % 30

    # Build the formatted string based on the components
    formatted_time = []
    if years > 0:
        formatted_time.append(f"{years} yr{'s' if years > 1 else ''}")
    if months > 0:
        formatted_time.append(f"{months} mo")
    if remaining_days > 0 or (years == 0 and months == 0):
        formatted_time.append(f"{remaining_days} d")
    if remaining_days == 0 and years == 0 and months == 0:
        return "Today"
    
    return ", ".join(formatted_time)

# Function to process files and generate a table with the desired information
def analyze_files(file_keys, figma_token, repo_owner, repo_name, github_token):
    table_data = []
    branches_by_issue = {}

    for file in file_keys:
        file_key = file["key"]
        file_name = file["name"]
        file_data = get_figma_file_data(file_key, figma_token)
        
        if file_data:
            branches = file_data.get("branches", [])
            num_branches = len(branches)
            
            if num_branches > 0:
                first_branch = True
                for branch in branches:
                    branch_name = branch["name"]
                    branch_link = f"[{branch_name}](https://www.figma.com/file/{file_key}/branch/{branch['key']})"
                    
                    # Extract the issue number using regex
                    issue_match = re.match(r"#(\d+)", branch_name)
                    issue_number = issue_match.group(1) if issue_match else None
                    issue_display = f"#{issue_number}" if issue_number else ""

                    # Calculate the days since the last modification using timezone-aware datetime
                    last_modified_str = branch["last_modified"]
                    last_modified_dt = datetime.strptime(last_modified_str, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
                    current_time = datetime.now(timezone.utc)
                    days_since_modification = (current_time - last_modified_dt).days

                    # Format the time difference
                    formatted_time = format_time_difference(days_since_modification)

                    # Collect branch info for commenting on the issue
                    if issue_number:
                        figma_url = f"https://www.figma.com/file/{file_key}/branch/{branch['key']}"
                        branches_by_issue.setdefault(issue_number, []).append({
                            "file_name": file_name,
                            "name": branch_name,
                            "url": figma_url,
                            "last_modification": formatted_time
                        })

                    # Get the issue status from GitHub
                    issue_status = get_issue_status(repo_owner, repo_name, issue_number, github_token) if issue_number else ""
                    
                    table_data.append({
                        "File Name": file_name if first_branch else "",
                        "Branch Names": branch_link,
                        "Issue": issue_display,
                        "Status": issue_status,
                        "Last Modification": formatted_time
                    })

                    first_branch = False
    
    df = pd.DataFrame(table_data)
    return df, branches_by_issue

# Function to update the issue on GitHub
def update_github_issue(issue_number, repo_owner, repo_name, markdown_content, github_token):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{issue_number}"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "body": markdown_content
    }

    response = requests.patch(url, json=data, headers=headers)

    if response.status_code == 200:
        print("Issue updated successfully")
    else:
        print(f"Failed to update issue: {response.status_code} - {response.text}")

FIGMA_COMMENT_MARKER = "<!-- figma-branches -->"

# Function to find an existing Figma branches comment on an issue
def find_existing_figma_comment(repo_owner, repo_name, issue_number, github_token):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{issue_number}/comments"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    page = 1
    while True:
        response = requests.get(url, headers=headers, params={"page": page, "per_page": 100})
        if response.status_code != 200:
            break
        comments = response.json()
        if not comments:
            break
        for comment in comments:
            if FIGMA_COMMENT_MARKER in comment.get("body", ""):
                return comment["id"]
        page += 1
    return None

# Function to create a comment on a GitHub issue
def create_issue_comment(repo_owner, repo_name, issue_number, body, github_token):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{issue_number}/comments"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    response = requests.post(url, json={"body": body}, headers=headers)
    if response.status_code == 201:
        print(f"Comment created on issue #{issue_number}")
    else:
        print(f"Failed to comment on issue #{issue_number}: {response.status_code}")

# Function to update an existing comment on a GitHub issue
def update_issue_comment(repo_owner, repo_name, comment_id, body, github_token):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/comments/{comment_id}"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    response = requests.patch(url, json={"body": body}, headers=headers)
    if response.status_code == 200:
        print(f"Comment updated (ID: {comment_id})")
    else:
        print(f"Failed to update comment {comment_id}: {response.status_code}")

# Function to comment Figma branch links on individual issues
def comment_figma_branches_on_issues(branches_by_issue, repo_owner, repo_name, github_token):
    for issue_number, branches in branches_by_issue.items():
        rows = "\n".join(f"| {b['file_name']} | [{b['name']}]({b['url']}) | {b['last_modification']} |" for b in branches)
        table = f"| File | Branch | Last Modification |\n| --- | --- | --- |\n{rows}"
        body = f"{FIGMA_COMMENT_MARKER}\nFigma branches linked to this issue\n\n{table}"

        existing_comment_id = find_existing_figma_comment(repo_owner, repo_name, issue_number, github_token)

        if existing_comment_id:
            update_issue_comment(repo_owner, repo_name, existing_comment_id, body, github_token)
        else:
            create_issue_comment(repo_owner, repo_name, issue_number, body, github_token)

# Personal access token for Figma and GitHub APIs
figma_token = os.getenv("FIGMA_TOKEN")
github_token = os.getenv("GITHUB_TOKEN")

# GitHub repo details
repo_owner = "Telefonica"
repo_name = "mistica-design"

# List of Figma project IDs
project_ids = [
    "25719143",  # Mística Libraries
    "266390224", # Mística Skins Libraries
    "27955986",  # Specs
    "170790970", # Community Specs
    "30110755"   # Materials
]

# Fetch all file keys from the specified Figma projects
file_keys = get_figma_project_files(project_ids, figma_token)

# Analyze the files and generate the table
df, branches_by_issue = analyze_files(file_keys, figma_token, repo_owner, repo_name, github_token)

# Comment on individual issues with Figma branch links
comment_figma_branches_on_issues(branches_by_issue, repo_owner, repo_name, github_token)

# Convert the table to markdown format
markdown_table = df.to_markdown(index=False)

# Update the issue on GitHub
issue_number = 1927  # Change this as needed
update_github_issue(issue_number, repo_owner, repo_name, markdown_table, github_token)

# Print the table to the console
print(markdown_table)
