import os
import re
import requests


def _load_env_value(key):
    """Read a value from .env supporting both KEY=VALUE and KEY: VALUE formats."""
    env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
    if not os.path.exists(env_path):
        return os.getenv(key)
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith(key):
                # Handle both KEY=VALUE and KEY: VALUE
                for sep in ['=', ':']:
                    if sep in line:
                        val = line.split(sep, 1)[1].strip().strip('"').strip("'")
                        if val:
                            return val
    return os.getenv(key)


FIGMA_TOKEN = _load_env_value("FIGMA_TOKEN")
HEADERS = {"X-Figma-Token": FIGMA_TOKEN}

LIBRARIES = {
    "mobile": "WCkDDzlXE16R6yXaljxddj",
    "desktop": "DSWhPLyJzbliP1fBrLxDUR",
}


def get_file_tree(file_key):
    """Fetch the full document tree from Figma."""
    url = f"https://api.figma.com/v1/files/{file_key}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()


def get_image_urls(file_key, node_ids):
    """Render nodes as PNGs and return their download URLs."""
    if not node_ids:
        return {}
    ids_param = ",".join(node_ids)
    url = f"https://api.figma.com/v1/images/{file_key}?ids={ids_param}&format=png&scale=2"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json().get("images", {})


def download_image(url, path):
    """Download an image from a URL and save it to disk."""
    response = requests.get(url)
    response.raise_for_status()
    with open(path, "wb") as f:
        f.write(response.content)


def clean_filename(name):
    """Sanitize a frame name for use as a filename."""
    return re.sub(r'[\/:*?"<>|]', '_', name)
