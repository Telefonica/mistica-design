import os
import numpy as np
from PIL import Image


def load_image_as_array(path):
    """Load a PNG as an RGBA numpy array."""
    img = Image.open(path).convert("RGBA")
    return np.array(img)


def pad_to_match(arr1, arr2):
    """Pad the smaller array with transparent pixels so both have the same dimensions."""
    h1, w1 = arr1.shape[:2]
    h2, w2 = arr2.shape[:2]
    max_h = max(h1, h2)
    max_w = max(w1, w2)

    def pad(arr, target_h, target_w):
        h, w = arr.shape[:2]
        if h == target_h and w == target_w:
            return arr
        padded = np.zeros((target_h, target_w, 4), dtype=np.uint8)
        padded[:h, :w] = arr
        return padded

    return pad(arr1, max_h, max_w), pad(arr2, max_h, max_w)


def diff_images(baseline_path, branch_path, diff_path):
    """Compare two PNGs pixel-by-pixel.

    Produces a diff image where changed pixels are highlighted in red.
    Returns the number of changed pixels.
    """
    baseline = load_image_as_array(baseline_path)
    branch = load_image_as_array(branch_path)

    if baseline.shape != branch.shape:
        baseline, branch = pad_to_match(baseline, branch)

    # Compare RGB channels (ignore alpha for diff detection)
    diff_mask = np.any(baseline[:, :, :3] != branch[:, :, :3], axis=2)
    changed_pixels = int(np.sum(diff_mask))

    # Build diff image: branch image with changed pixels highlighted in red
    diff_img = branch.copy()
    diff_img[diff_mask] = [255, 0, 0, 255]

    Image.fromarray(diff_img).save(diff_path)
    return changed_pixels


def diff_all(baseline_dir, branch_dir, diff_dir):
    """Compare all PNGs between baseline and branch directories.

    Returns a list of dicts with comparison results.
    """
    os.makedirs(diff_dir, exist_ok=True)

    baseline_files = {f for f in os.listdir(baseline_dir) if f.endswith(".png")}
    branch_files = {f for f in os.listdir(branch_dir) if f.endswith(".png")}

    all_names = baseline_files | branch_files
    results = []

    for filename in sorted(all_names):
        name = filename.removesuffix(".png")
        baseline_path = os.path.join(baseline_dir, filename)
        branch_path = os.path.join(branch_dir, filename)
        diff_path = os.path.join(diff_dir, filename)

        if filename not in baseline_files:
            results.append({
                "name": name,
                "status": "added",
                "changed_pixels": 0,
                "baseline_path": None,
                "branch_path": branch_path,
                "diff_path": None,
            })
        elif filename not in branch_files:
            results.append({
                "name": name,
                "status": "removed",
                "changed_pixels": 0,
                "baseline_path": baseline_path,
                "branch_path": None,
                "diff_path": None,
            })
        else:
            changed_pixels = diff_images(baseline_path, branch_path, diff_path)
            status = "changed" if changed_pixels > 0 else "unchanged"
            results.append({
                "name": name,
                "status": status,
                "changed_pixels": changed_pixels,
                "baseline_path": baseline_path,
                "branch_path": branch_path,
                "diff_path": diff_path if changed_pixels > 0 else None,
            })

    return results
