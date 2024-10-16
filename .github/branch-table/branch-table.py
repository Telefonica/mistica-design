import requests
import pandas as pd
import os

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

# Function to process files and generate a table with the desired information
def analyze_files(file_keys, figma_token):
    table_data = []
    
    for file_key in file_keys:
        file_data = get_figma_file_data(file_key, figma_token)
        
        if file_data:
            file_name = file_data.get("name", "Unknown")
            branches = file_data.get("branches", [])
            num_branches = len(branches)
            
            # Only add the file if it has branches
            if num_branches > 0:
                # Create links for each branch, in Markdown list format
                branch_links = [f"- [{branch['name']}](https://www.figma.com/file/{file_key}/branch/{branch['key']})"
                                for branch in branches]
                
                branch_links_str = "\n".join(branch_links)
                
                table_data.append({
                    "File Name": file_name,
                    "Branches": num_branches,
                    "Branch Names": branch_links_str
                })
    
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
    

# List of Figma file keys to analyze
file_keys = [
    "WCkDDzlXE16R6yXaljxddj",
    "DSWhPLyJzbliP1fBrLxDUR",
    "w7fBxCsEb8WrMVVuxDnCQd",
    "JHuzksh01yxExMeMQBvymq",
    "ObNHOLPtrIytjy9BH7M9jW",
    "m8srmP3eedfvDaqYnbM6PI",
    "19IXMaFqdYeC1IIdTwXBgY",
    "czemeClWRGBI8oF7caNa5m",
    "CjvgrHEIycSQ6exznxnFXT",
    "EApRpjaTyUOwW5VQU2ZqgP",
    "JXy7Y07eb0Axg0ThVRWKju",
    "jWWCJ9kYl6I5uHLz3GcgRp",
    "KDxPjcTXq2NCvQZjb4FXgi",
    "U4ipIXOk64bdM5tSvaqPKS",
    "gUZfZajV9Zfade0rBYWZQg",
    "BctaFHf0PVPX2uwRSl8taf",
    "koROdh3HpEPG2O8jG52Emh",
    "LzhzNPzE8nY9d7Yvo10d5d",
    "tKdPOfcUALzVIh5oizFbm7",
    "hxJvuIQQ1xf50xIOQFUZbQ",
    "6IN1rHqpYLILjgWMuUGKvJ",
    "512a5Ke4EldL0GYffCXGCJ",
    "LhZ5g2KAckJLzBIA1720H0",
    "XiGe8xqm5OOjUSmdhU4rzA",
    "DAXzyfp6gf7G9SUsnKgTzJ",
    "LpjgnU1xpmEzQvlXKwAHmn",
    "Xm3r8nRNlbAiZNlkaH5YX1",
    "M8t65SWdTUyM44YjxuzCyu",
    "3iEvVzfHBtg3sROXBHzkn7",
    "e8d3PkXitUJ1Jwgc9Y3mNc",
    "ncQ4GRI3ZEjEtNW6pyROX2",
    "Be8QB9onmHunKCCAkIBAVr",
    "KYdCKU8obcDapI8ihpsaWs",
    "YYWgtxCOpR87Nq5SbSzI8k",
    "a1pgrI7Wg41iyXWU8ETqlU",
    "8TXIyWTJ8plJ06i1qwv97k",
    "4GmsXwcMOapuCa0Atm6E84",
    "Os5UfsnhLtQ9rnzmtcX8J4",
    "gmcy7hwB9WXxqT05jBnA3W",
    "3IO1EsGDeBRiFdF23mrvuj",
    "RkHDrAELuQIlwNSQBfjSBx",
    "lqCbeKPfXwOWxSFGOO4bY4",
    "nxToAYk7FGC86TS0mY61TU",
    "w7E0mmB92eio0zHw7h9iS2",
    "UZHm7V3gO7nVnbf1b0Vj7b",
    "yCHLIfy4WMfRdlADwyL4kZ",
    "O3uLKJQ1MNsMFXYqmyPTn8",
    "3ME86VKaAQ2BoeqoQuHMYx",
    "YIQIeK0R4bQNNkw2Friv6b",
    "J0LzwXn0tzGNIkgvFnt0Yz",
    "WtF16bfvE9kKS4yx3VtLuE",
    "tOb2OmRf6gnEK3fnSWPKOG",
    "wseConngNv2MYEXgCk5uI4",
    "f9tAOJproMIiJJuPchDEhG",
    "81rPCqGchGf54aoh2kpF1o",
    "MU9VZyeyzTSDPLWmZMGYkK",
    "yQRVCOmRQNM98bnXndLPxK",
    "5xDoAS5UTtTPMP8zDsxiMt",
    "il3GkMh7p85wpXvtWuvLRT",
    "InXkFcu9cBzKmMjZtKXSy7",
    "dvMqeg6s8tDh9Hyxu7IYDl",
    "aNHyvXe1mqjaelE8XWVQD5",
    "pzcfoIj4osTMiOHoChiCFm",
    "PApssATUkePZnIOB4GmAeI",
    # Add more file keys here
]

# Personal access token for Figma and GitHub APIs
figma_token = os.getenv("FIGMA_TOKEN")
github_token = os.getenv("GITHUB_TOKEN")

# Analyze the files and generate the table
df = analyze_files(file_keys, figma_token)

# Convert the table to markdown format
markdown_table = df.to_markdown(index=False)

# Update the issue on GitHub
repo_owner = "Telefonica"
repo_name = "mistica-design"
issue_number = 1927  # Change this number to the issue number you want to update

update_github_issue(issue_number, repo_owner, repo_name, markdown_table, github_token)