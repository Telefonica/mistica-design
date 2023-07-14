import os

# pip install packaging
from packaging.version import parse as parse_version

BREAK = "\n"

# folder path
dir_path = r'./changelog-versions'

# list to store files
changelog_files_extension = []

# Iterate directory
for path in os.listdir(dir_path):
    # check if current path is a file
    if os.path.isfile(os.path.join(dir_path, path)):
        changelog_files_extension.append(path)
    if path == ".DS_Store":
        changelog_files_extension.remove(path)
# print(changelog_files_extension)

# Remove extension from files
changelog_files = list(
    map(lambda x: x.replace('.md', ''), changelog_files_extension))
# print(changelog_files)

# Sort files by version
changelog_files_sorted = sorted(changelog_files, reverse=True, key=lambda x: [int(
    i) if i.isdigit() else i for i in x.split('.')])
print(changelog_files_sorted)

changelog_version = ""

# Generate list of versions in markdown format
for item in changelog_files_sorted:
    # print(item)
    # If version is major, then use ## for make this version as a "large" title
    major = "## " if item.endswith('.0.0') else ""
    changelog_version += major + "[" + item + "]" + \
        "(" + "changelog-versions/" + item + ".md" + ")" + BREAK + BREAK
    # print(changelog_version)

# Empty line
print()

# Draw markdown file
file_content = "# Figma Changelog" + BREAK + BREAK + changelog_version + "---" + BREAK + \
    "[Changelog history →](https://paper.dropbox.com/doc/Changelog-Mistica-Design-System--BlDyPv0kWq8W502b64VVIPMsAQ-il1pWXaGur0Nm88P831X2)" + BREAK
print(file_content)

# Save file
output_file_path = "./CHANGELOG.md"
file = open(output_file_path, "w+")
file.write(file_content)
file.close()
