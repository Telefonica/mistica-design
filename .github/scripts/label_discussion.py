import os
import json
import requests

# GitHub repository and token
REPO = 'Telefonica/mistica-design'
TOKEN = os.getenv('NOVUM_PRIVATE_REPOS')
API_URL = f"https://api.github.com/repos/{REPO}"

# Verifica si el token está presente
if not TOKEN:
    raise ValueError("NOVUM_PRIVATE_REPOS no está configurado")

# Depuración: Imprime los primeros caracteres del token
print(f"TOKEN: {TOKEN[:4]}...")

# Get event data from environment variable
event_path = os.getenv('GITHUB_EVENT_PATH')
with open(event_path) as f:
    event_data = json.load(f)

# Determine if the event is a discussion or a discussion comment
if 'discussion' in event_data:
    discussion_id = event_data['discussion']['node_id']
    discussion_title = event_data['discussion']['title']
    discussion_body = event_data['discussion']['body']
elif 'comment' in event_data:
    discussion_id = event_data['comment']['discussion_id']
    discussion_title = ""  # Comments do not have a title
    discussion_body = event_data['comment']['body']
else:
    raise ValueError("Evento no reconocido")

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
