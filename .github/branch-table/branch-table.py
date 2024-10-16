import requests
import pandas as pd
import os
import re
from datetime import datetime, timezone

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
        formatted_time.append(f"{years}yr{'s' if years > 1 else ''}")
    if months > 0:
        formatted_time.append(f"{months}mo")
    if remaining_days > 0 or (years == 0 and months == 0):
        formatted_time.append(f"{remaining_days}d")
    if remaining_days == 0 and years == 0 and months == 0:
        return "Today"
    
    return ", ".join(formatted_time)

# Function to process files and generate a table with the desired information
def analyze_files(file_keys, figma_token):
    table_data = []
    
    for file in file_keys:
        file_key = file["key"]
        file_name = file["name"]
        file_data = get_figma_file_data(file_key, figma_token)
        
        if file_data:
            branches = file_data.get("branches", [])
            num_branches = len(branches)
            
            # Only add the file if it has branches
            if num_branches > 0:
                first_branch = True
                for branch in branches:
                    branch_name = branch["name"]
                    branch_link = f"[{branch_name}](https://www.figma.com/file/{file_key}/branch/{branch['key']})"
                    
                    # Extract the issue number using regex
                    issue_match = re.match(r"#(\d+)", branch_name)
                    issue_number = "#" + issue_match.group(1) if issue_match else ""

                   # Calculate the days since the last modification using timezone-aware datetime
                    last_modified_str = branch["last_modified"]
                    last_modified_dt = datetime.strptime(last_modified_str, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
                    current_time = datetime.now(timezone.utc)
                    days_since_modification = (current_time - last_modified_dt).days
                    
                    # Format the time difference
                    formatted_time = format_time_difference(days_since_modification)
                    
                    table_data.append({
                        "File Name": file_name if first_branch else "",
                        # "Branches": num_branches if first_branch else "",
                        "Branch Names": branch_link,
                        "Issue": issue_number,
                        "Last modified": formatted_time
                        
                    })

                    # After the first branch, set first_branch to False
                    first_branch = False
    
    # Create a DataFrame with the collected information
    df = pd.DataFrame(table_data)
    return df

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

# Personal access token for Figma and GitHub APIs
figma_token = os.getenv("FIGMA_TOKEN")
github_token = os.getenv("GITHUB_TOKEN")

# List of project IDs to fetch files from
project_ids = [
    "25719143", # Mística Libraries
    "266390224", # Mística Skins Libraries
    "27955986", # Specs
    "170790970", # Community Specs
    "30110755" # Materials
    # Add more project id here
]

# Fetch all file keys from the specified Figma projects
file_keys = get_figma_project_files(project_ids, figma_token)

# Analyze the files and generate the table
df = analyze_files(file_keys, figma_token)

# Convert the table to markdown format
markdown_table = df.to_markdown(index=False)

# Update the issue on GitHub
repo_owner = "Telefonica"
repo_name = "mistica-design"
issue_number = 1927  # Change this number to the issue number you want to update

update_github_issue(issue_number, repo_owner, repo_name, markdown_table, github_token)

# Print the table to the console
print(markdown_table)

