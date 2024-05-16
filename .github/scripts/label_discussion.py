import os
import json
import requests

# GitHub repository and token
REPO = 'Telefonica/mistica-design'
TOKEN = os.getenv('NOVUM_PRIVATE_REPOS')
API_URL = f"https://api.github.com/repos/{REPO}"

# Get discussion data from environment variable
event_path = os.getenv('GITHUB_EVENT_PATH')
with open(event_path) as f:
    discussion = json.load(f)

discussion_id = discussion['discussion']['node_id']
discussion_title = discussion['discussion']['title']
discussion_body = discussion['discussion']['body']

# Function to get existing labels
def get_existing_labels():
    headers = {
        'Authorization': f'token {TOKEN}',
        'Accept': 'application/vnd.github.v3+json',
    }
    response = requests.get(f'{API_URL}/labels', headers=headers)
    response.raise_for_status()
    return [label['name'] for label in response.json()]

# Function to apply label
def apply_label(label):
    headers = {
        'Authorization': f'token {TOKEN}',
        'Accept': 'application/vnd.github.v3+json',
    }
    data = {
        'labels': [label]
    }
    response = requests.post(f'{API_URL}/discussions/{discussion_id}/labels', headers=headers, json=data)
    response.raise_for_status()

# Function to determine appropriate label
def determine_label(title, body, labels):
    # Simple keyword matching for demonstration; improve with NLP techniques as needed
    keywords_to_labels = {
        'bug': 'bug',
        'feature': 'enhancement',
        'question': 'question'
    }

    for keyword, label in keywords_to_labels.items():
        if keyword in title.lower() or keyword in body.lower():
            if label in labels:
                return label
    return None

# Main script logic
existing_labels = get_existing_labels()
label_to_apply = determine_label(discussion_title, discussion_body, existing_labels)

if label_to_apply:
    apply_label(label_to_apply)