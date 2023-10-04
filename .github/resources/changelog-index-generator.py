import os
from packaging.version import parse as parse_version
from datetime import datetime
import git

BREAK = "\n"

# folder path
dir_path = r'./changelog-versions'

# list to store files with creation dates and first commit dates
changelog_files_with_dates = []

# Iterate directory
for path in os.listdir(dir_path):
    # check if current path is a file
    if os.path.isfile(os.path.join(dir_path, path)):
        file_name = path.replace('.md', '')  # Remove extension
        file_path = os.path.join(dir_path, path)

        # Get first commit date using gitpython
        repo = git.Repo(search_parent_directories=True)
        first_commit_date = repo.git.log('--format=%aI', '--', file_path).splitlines()[-1]

        # Format the date
        first_commit_date = datetime.fromisoformat(first_commit_date).strftime('%Y-%m-%d')

        changelog_files_with_dates.append((file_name, first_commit_date))

# Sort files by version
changelog_files_with_dates_sorted = sorted(changelog_files_with_dates, reverse=True, key=lambda x: [int(
    i) if i.isdigit() else i for i in x[0].split('.')])

# Generate list of versions in markdown format
changelog_version = ""

# Agregar el encabezado de la tabla en Markdown
changelog_version += "| Version | Release date |\n"
changelog_version += "| ------- | ----------------------- |\n"

for item, first_commit_date in changelog_files_with_dates_sorted:
    if item.endswith('.0.0'):
        major = f"**[{item}](changelog-versions/{item}.md)**"
    else:
        major = f"[{item}](changelog-versions/{item}.md)"

    # Agregar una fila de la tabla en Markdown para cada versión
    changelog_version += f"| {major} | {first_commit_date}|\n"

# Agregar saltos de línea según tu BREAK
changelog_version += BREAK + BREAK


# Empty line
print()

# Draw markdown file
file_content = "# Figma Changelog" + BREAK + BREAK + changelog_version + "---" + BREAK + \
    "[Changelog history →](https://paper.dropbox.com/doc/Changelog-Mistica-Design-System--BlDyPv0kWq8W502b64VVIPMsAQ-il1pWXaGur0Nm88P831X2)" + BREAK

# Save file
output_file_path = "./CHANGELOG.md"
file = open(output_file_path, "w+")
file.write(file_content)
file.close()
