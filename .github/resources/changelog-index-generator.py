import os
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
print(changelog_files)

# Sort files by version
changelog_files_sorted = sorted(changelog_files, reverse=True, key=lambda x: [int(
    i) if i.isdigit() else i for i in x.split('.')])
print(changelog_files_sorted)

changelog_version = ""

for item in changelog_files_sorted:
    # print(item)
    if item.endswith('.0.0'):
        changelog_version += "## " + "[" + "**" + item + "**" + "]" + \
            "(" + "changelog-versions/" + item + ".md" + ")" + BREAK + BREAK
    else:
        changelog_version += "[" + item + "]" + \
            "(" + "changelog-versions/" + item + ".md" + ")" + BREAK + BREAK
        # print(changelog_version)

file_content = "# Changelog index" + BREAK + changelog_version
# print(file_content)

output_file_path = "./CHANGELOG.md"
file = open(output_file_path, "w+")
file.write(file_content)
file.close()
