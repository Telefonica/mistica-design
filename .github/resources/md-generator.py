# !/usr/bin/python

import os
import sys

PIPE = "|"
SLASH = "/"
MD_EXTENSION = ".md"
BREAK = "\n"


def read_folder(folder):
    if os.path.isdir(folder):
        files = os.listdir(folder)
        if ".DS_Store" in files:
            files.remove(".DS_Store")
        return files
    return []


md_versions = set()

for root, dirs, files in os.walk('changelog-versions/'):
    for file in files:
        if file.endswith(".md"):
            md_versions.add(file)

print(md_versions)

if __name__ == '__main__':
    path = sys.argv[0]
    versions = read_folder(path)
    root = os.path.basename(path)
    md_versions = {}
    file_content = "### Release versions" + BREAK

    print(md_versions)
    for version in sorted(md_versions.keys()):
        versions = md_versions[version]
        for versions in sorted(version.keys()):
            list = "- " + "[ ]" + version + BREAK
            file_content += list + BREAK

    print(md_versions)
    output_file_path = "./README.md"
    print(output_file_path)
    print(file_content)
    # file = open(output_file_path, "w+")
    # file.write(file_content)
    # file.close()
