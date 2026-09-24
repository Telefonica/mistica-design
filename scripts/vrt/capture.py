import os
from figma_api import get_file_tree, get_image_urls, download_image, clean_filename


def find_vrt_frames(node):
    """Recursively find all frames whose name starts with 'VRT'."""
    vrt_frames = {}

    if "children" in node:
        for child in node["children"]:
            vrt_frames.update(find_vrt_frames(child))

    if node.get("type") in ["FRAME", "COMPONENT", "INSTANCE"] and node["name"].startswith("VRT"):
        vrt_frames[node["id"]] = clean_filename(node["name"])

    return vrt_frames


def capture_all(file_key, output_dir):
    """Capture all VRT frames from a Figma file as PNGs.

    Returns a dict mapping sanitized frame name -> PNG file path.
    """
    os.makedirs(output_dir, exist_ok=True)

    print(f"Fetching file tree for {file_key}...")
    file_data = get_file_tree(file_key)
    document = file_data["document"]

    vrt_frames = find_vrt_frames(document)
    if not vrt_frames:
        print("No VRT frames found.")
        return {}

    print(f"Found {len(vrt_frames)} VRT frame(s). Rendering PNGs...")
    image_urls = get_image_urls(file_key, list(vrt_frames.keys()))

    captured = {}
    for node_id, img_url in image_urls.items():
        if not img_url:
            print(f"  Warning: no image for node {node_id}")
            continue
        name = vrt_frames.get(node_id, node_id)
        path = os.path.join(output_dir, f"{name}.png")
        download_image(img_url, path)
        captured[name] = path
        print(f"  Saved: {name}.png")

    return captured
