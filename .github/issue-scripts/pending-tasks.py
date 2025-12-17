import os
from github import Github
from datetime import datetime

def count_checkboxes(text):
    """Count checked and unchecked checkboxes in a text"""
    if text is None:
        return 0, 0
    
    checked = text.count('- [x]') + text.count('- [X]')
    unchecked = text.count('- [ ]')
    return checked, unchecked

def format_time_difference(days):
    """Format time difference in years, months and days"""
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

def analyze_issues_with_pending_tasks(token, owner, repo, target_issue_number):
    """Analyze closed issues with pending checkboxes and update the report"""
    
    # Repository base URL
    repo_url = f'https://github.com/{owner}/{repo}'

    # Create a Github class instance using the access token
    g = Github(token)

    # Get the repository
    repository = g.get_repo(f'{owner}/{repo}')

    # Search for closed issues in the repository
    closed_issues = repository.get_issues(state='closed')

    # Lista para almacenar las issues con checkboxes desactivados
    issues_con_checkboxes_desactivados = []

    # Itera sobre las issues cerradas
    for issue in closed_issues:
        # Exclude the report issue (where this report is displayed)
        if issue.number == target_issue_number:
            continue
            
        has_unchecked = False
        
        # Verify that the issue body is not None
        if issue.body is not None and '- [ ]' in issue.body:
            has_unchecked = True

        # If not found in the body, search in comments
        if not has_unchecked:
            comments = issue.get_comments()
            for comment in comments:
                if comment.body is not None and '- [ ]' in comment.body:
                    has_unchecked = True
                    break

        if has_unchecked:
            issues_con_checkboxes_desactivados.append(issue)

    # Sort issues by last modification date (most recent first)
    issues_con_checkboxes_desactivados.sort(key=lambda x: x.updated_at, reverse=True)

    # Print the list of issues with unchecked checkboxes
    print("Issues con checkboxes desactivados:")
    for issue in issues_con_checkboxes_desactivados:
        issue_url = f'{repo_url}/issues/{issue.number}'
        print(f"Issue #{issue.number}: {issue.title} ({issue_url})")

    # Create markdown table
    table_header = "| Issue | Name | Progress | Last Modification |\n"
    table_separator = "|-------|------|----------|:------------------|\n"
    table_rows = ""

    for issue in issues_con_checkboxes_desactivados:
        issue_link = f"[#{issue.number}]({repo_url}/issues/{issue.number})"
        issue_name = issue.title.replace("|", "\\|")  # Escape pipes in the title
        
        # Calculate days since last modification
        current_time = datetime.now(issue.updated_at.tzinfo)
        days_since_modification = (current_time - issue.updated_at).days
        last_modified = format_time_difference(days_since_modification)
        
        # Contar checkboxes en el body de la issue
        checked_body, unchecked_body = count_checkboxes(issue.body)
        
        # Contar checkboxes en los comentarios
        checked_comments = 0
        unchecked_comments = 0
        comments = issue.get_comments()
        for comment in comments:
            c_checked, c_unchecked = count_checkboxes(comment.body)
            checked_comments += c_checked
            unchecked_comments += c_unchecked
        
        # Total checkboxes
        total_checked = checked_body + checked_comments
        total_unchecked = unchecked_body + unchecked_comments
        total_checkboxes = total_checked + total_unchecked
        
        progress = f"{total_checked} / {total_checkboxes}"
        
        table_rows += f"| {issue_link} | {issue_name} | {progress} | {last_modified} |\n"

    # Create the new issue body
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
    new_body = f"""# Pending Tasks Report

**Last Updated:** {current_time}
**Total Issues Found:** {len(issues_con_checkboxes_desactivados)}

## Issues with Unchecked Checkboxes

{table_header}{table_separator}{table_rows}

---
*This report shows closed issues that still contain unchecked checkboxes in their description or comments.*
*Progress column shows: completed tasks / total tasks*
"""

    # Update the report issue
    try:
        target_issue = repository.get_issue(target_issue_number)
        target_issue.edit(body=new_body)
        print(f"\n✅ Issue #{target_issue_number} updated successfully!")
        print(f"Total issues with unchecked checkboxes: {len(issues_con_checkboxes_desactivados)}")
        return True
    except Exception as e:
        print(f"\n❌ Error updating issue #{target_issue_number}: {str(e)}")
        return False

def main():
    """Main function"""
    # Get environment variables
    token = os.environ.get('TOKEN')
    if not token:
        print("❌ Error: TOKEN environment variable not found")
        return False

    # Repository configuration
    owner = 'Telefonica'
    repo = 'mistica-design'
    target_issue_number = 2490

    return analyze_issues_with_pending_tasks(token, owner, repo, target_issue_number)

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)