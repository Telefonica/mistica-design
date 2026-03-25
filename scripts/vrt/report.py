import base64
import os


def image_to_base64(path):
    """Convert an image file to a base64 data URI."""
    if not path or not os.path.exists(path):
        return ""
    with open(path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"


def generate_report(results, output_path, library_name, branch_key):
    """Generate a self-contained HTML report from diff results."""
    changed = [r for r in results if r["status"] == "changed"]
    unchanged = [r for r in results if r["status"] == "unchanged"]
    added = [r for r in results if r["status"] == "added"]
    removed = [r for r in results if r["status"] == "removed"]

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VRT Report — {library_name}</title>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; padding: 24px; }}
  h1 {{ font-size: 24px; margin-bottom: 8px; }}
  .meta {{ color: #666; font-size: 14px; margin-bottom: 24px; }}
  .summary {{ display: flex; gap: 16px; margin-bottom: 32px; }}
  .summary-card {{ background: white; border-radius: 8px; padding: 16px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }}
  .summary-card .count {{ font-size: 32px; font-weight: 700; }}
  .summary-card .label {{ font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }}
  .summary-card.changed .count {{ color: #e53e3e; }}
  .summary-card.added .count {{ color: #38a169; }}
  .summary-card.removed .count {{ color: #d69e2e; }}
  .summary-card.unchanged .count {{ color: #718096; }}
  .section-title {{ font-size: 18px; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }}
  .component {{ background: white; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }}
  .component-header {{ padding: 12px 16px; background: #f7fafc; border-bottom: 1px solid #e2e8f0; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }}
  .component-header .pixels {{ font-size: 12px; color: #e53e3e; font-weight: 400; }}
  .component-images {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: #e2e8f0; }}
  .component-images.single {{ grid-template-columns: 1fr; }}
  .image-col {{ background: white; padding: 8px; }}
  .image-col .col-label {{ font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }}
  .image-col img {{ max-width: 100%; height: auto; display: block; }}
  .toggle {{ cursor: pointer; color: #4a90d9; font-size: 14px; margin-top: 16px; }}
  .hidden {{ display: none; }}
</style>
</head>
<body>
<h1>VRT Report — {library_name.capitalize()}</h1>
<p class="meta">Branch: <code>{branch_key}</code></p>

<div class="summary">
  <div class="summary-card changed"><div class="count">{len(changed)}</div><div class="label">Changed</div></div>
  <div class="summary-card added"><div class="count">{len(added)}</div><div class="label">Added</div></div>
  <div class="summary-card removed"><div class="count">{len(removed)}</div><div class="label">Removed</div></div>
  <div class="summary-card unchanged"><div class="count">{len(unchanged)}</div><div class="label">Unchanged</div></div>
</div>
"""

    if changed:
        html += '<h2 class="section-title">Changed</h2>\n'
        for r in changed:
            baseline_b64 = image_to_base64(r["baseline_path"])
            branch_b64 = image_to_base64(r["branch_path"])
            diff_b64 = image_to_base64(r["diff_path"])
            html += f"""<div class="component">
  <div class="component-header">{r['name']} <span class="pixels">{r['changed_pixels']:,} px changed</span></div>
  <div class="component-images">
    <div class="image-col"><div class="col-label">Baseline</div><img src="{baseline_b64}" alt="baseline"></div>
    <div class="image-col"><div class="col-label">Branch</div><img src="{branch_b64}" alt="branch"></div>
    <div class="image-col"><div class="col-label">Diff</div><img src="{diff_b64}" alt="diff"></div>
  </div>
</div>
"""

    if added:
        html += '<h2 class="section-title">Added</h2>\n'
        for r in added:
            branch_b64 = image_to_base64(r["branch_path"])
            html += f"""<div class="component">
  <div class="component-header">{r['name']}</div>
  <div class="component-images single">
    <div class="image-col"><div class="col-label">Branch (new)</div><img src="{branch_b64}" alt="new"></div>
  </div>
</div>
"""

    if removed:
        html += '<h2 class="section-title">Removed</h2>\n'
        for r in removed:
            baseline_b64 = image_to_base64(r["baseline_path"])
            html += f"""<div class="component">
  <div class="component-header">{r['name']}</div>
  <div class="component-images single">
    <div class="image-col"><div class="col-label">Baseline (removed)</div><img src="{baseline_b64}" alt="removed"></div>
  </div>
</div>
"""

    if unchanged:
        html += f"""<h2 class="section-title">Unchanged ({len(unchanged)})</h2>
<p class="toggle" onclick="document.getElementById('unchanged').classList.toggle('hidden')">Show/hide unchanged components</p>
<div id="unchanged" class="hidden">
"""
        for r in unchanged:
            html += f'  <div class="component"><div class="component-header">{r["name"]}</div></div>\n'
        html += "</div>\n"

    html += "</body>\n</html>"

    with open(output_path, "w") as f:
        f.write(html)

    print(f"Report saved to {output_path}")
