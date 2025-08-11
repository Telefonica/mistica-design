import requests
import os
import re
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

FIGMA_TOKEN = os.getenv("FIGMA_TOKEN")  
FILE_ID = "0xBbOJMi2krbK3tHlHZI4F"  
OUTPUT_DIR = ".github/vrt/__screenshot_tests__" 

HEADERS = {"X-Figma-Token": FIGMA_TOKEN}

# Function to clean filenames (avoid invalid characters)
def clean_filename(name):
    return re.sub(r'[\/:*?"<>|]', '_', name)  # Replace invalid characters in filenames

# Recursive function to find frames that start with "VRT"
def find_vrt_frames(node):
    vrt_frames = {}
    
    if "children" in node:  # If the node has children, traverse them
        for child in node["children"]:
            vrt_frames.update(find_vrt_frames(child))  # Recursive call

    # If it's a frame and its name starts with "VRT", save it
    if node["type"] in ["FRAME", "COMPONENT", "INSTANCE"] and node["name"].startswith("VRT"):
        vrt_frames[node["id"]] = clean_filename(node["name"])
    
    return vrt_frames

# Function to get frames from Figma API
def get_vrt_frames():
    url = f"https://api.figma.com/v1/files/{FILE_ID}"
    response = requests.get(url, headers=HEADERS)

    if response.status_code != 200:
        print("❌ Error fetching Figma data:", response.text)
        return {}

    figma_data = response.json()
    document_root = figma_data["document"]  # Document root

    return find_vrt_frames(document_root)  # Search through entire hierarchy

# Function to get export URLs for each frame
def get_export_urls(frame_ids):
    if not frame_ids:
        print("❌ No frames starting with 'VRT' found.")
        return {}

    ids_param = ",".join(frame_ids)
    url = f"https://api.figma.com/v1/images/{FILE_ID}?ids={ids_param}&format=png"
    response = requests.get(url, headers=HEADERS)

    if response.status_code != 200:
        print("❌ Error fetching image URLs:", response.text)
        return {}

    return response.json().get("images", {})

# Function to download PNG images with correct names
def download_images(image_urls, frame_names):
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    for frame_id, img_url in image_urls.items():
        if not img_url:
            print(f"⚠ No image found for {frame_id}")
            continue

        img_response = requests.get(img_url)
        if img_response.status_code == 200:
            filename = frame_names.get(frame_id, frame_id)  # Use frame name or ID if not available
            img_path = os.path.join(OUTPUT_DIR, f"{filename}.png")

            with open(img_path, "wb") as img_file:
                img_file.write(img_response.content)
            print(f"✅ Image saved: {img_path}")
        else:
            print(f"❌ Error downloading image {frame_id}")

# Main function
def main():
    vrt_frames = get_vrt_frames()
    if not vrt_frames:
        print("❌ No frames to export.")
        return

    image_urls = get_export_urls(vrt_frames.keys())
    download_images(image_urls, vrt_frames)

# Run script
if __name__ == "__main__":
    main()