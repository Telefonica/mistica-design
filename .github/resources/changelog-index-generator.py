import os

BREAK = "\n"

# folder path
dir_path = r'./changelog-versions'

# list to store files
changelog_files = []

# Iterate directory
for path in os.listdir(dir_path):
    # check if current path is a file
    if os.path.isfile(os.path.join(dir_path, path)):
        changelog_files.append(path)

    if path == ".DS_Store" and path == "index.md":
        changelog_files.remove(path)
print(changelog_files)

changelog_version = ""

for item in sorted(changelog_files, reverse=True):
    changelog_version += "- " + "[" + item.replace(".md", "") + "]" + \
        "(" + "changelog-versions/" + item + ")" + BREAK
    # print(changelog_version)

file_content = "# Changelog index" + BREAK + changelog_version

output_file_path = "./CHANGELOG.md"
file = open(output_file_path, "w+")
file.write(file_content)
file.close()
