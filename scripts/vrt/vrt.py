#!/usr/bin/env python3
"""VRT (Visual Regression Testing) for Mistica Figma libraries.

Usage:
    python scripts/vrt/vrt.py                     # Interactive mode
    python scripts/vrt/vrt.py save-baseline --library mobile|desktop|both
    python scripts/vrt/vrt.py diff --branch-key <KEY> --library mobile|desktop|both
"""

import argparse
import os
import re
import sys
import tempfile
import webbrowser

# Allow imports when run from repo root
sys.path.insert(0, os.path.dirname(__file__))

from figma_api import LIBRARIES
from capture import capture_all
from diff import diff_all
from report import generate_report

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASELINES_DIR = os.path.join(SCRIPT_DIR, "baselines")

# Reverse lookup: file_key -> library name
FILE_KEY_TO_LIBRARY = {v: k for k, v in LIBRARIES.items()}


def parse_figma_url(url):
    """Extract file_key and branch_key from a Figma URL.

    Supports:
      .../design/:fileKey/branch/:branchKey/...
      .../file/:fileKey/branch/:branchKey/...
    """
    match = re.search(r'figma\.com/(?:design|file)/([a-zA-Z0-9]+)/branch/([a-zA-Z0-9]+)', url)
    if match:
        return match.group(1), match.group(2)

    # Non-branch URL (main file)
    match = re.search(r'figma\.com/(?:design|file)/([a-zA-Z0-9]+)', url)
    if match:
        return match.group(1), None

    return None, None


def detect_library(file_key):
    """Detect which library a file key belongs to."""
    return FILE_KEY_TO_LIBRARY.get(file_key)


def run_diff(branch_key, library_name, file_key_override=None):
    """Run VRT diff for a branch against the stored baseline."""
    file_key = file_key_override or LIBRARIES[library_name]

    print(f"\nDiffing branch against {library_name} baseline...")

    baseline_dir = os.path.join(BASELINES_DIR, library_name)
    if not os.path.exists(baseline_dir) or not any(f.endswith(".png") for f in os.listdir(baseline_dir)):
        print(f"No baseline found for {library_name}. Run save-baseline first.")
        return

    with tempfile.TemporaryDirectory() as tmp_dir:
        branch_dir = os.path.join(tmp_dir, "branch")
        diff_dir = os.path.join(tmp_dir, "diffs")

        captured = capture_all(branch_key, branch_dir)
        if not captured:
            print(f"No VRT frames found in branch.")
            return

        results = diff_all(baseline_dir, branch_dir, diff_dir)

        # Write report to a stable path (self-contained HTML with base64 images)
        report_dir = os.path.join(SCRIPT_DIR, "reports")
        os.makedirs(report_dir, exist_ok=True)
        report_path = os.path.join(report_dir, f"{library_name}-report.html")
        generate_report(results, report_path, library_name, branch_key)

        changed = sum(1 for r in results if r["status"] == "changed")
        added = sum(1 for r in results if r["status"] == "added")
        removed = sum(1 for r in results if r["status"] == "removed")
        unchanged = sum(1 for r in results if r["status"] == "unchanged")
        print(f"\nSummary: {changed} changed, {added} added, {removed} removed, {unchanged} unchanged")

        webbrowser.open(f"file://{report_path}")
        print("Report opened in browser.")


def run_save_baseline(library_name, file_key_override=None):
    """Capture current main VRT frames and save as baseline."""
    file_key = file_key_override or LIBRARIES[library_name]

    print(f"\nSaving baseline for {library_name} ({file_key})...")

    output_dir = os.path.join(BASELINES_DIR, library_name)
    if os.path.exists(output_dir):
        for f in os.listdir(output_dir):
            if f.endswith(".png"):
                os.remove(os.path.join(output_dir, f))

    captured = capture_all(file_key, output_dir)
    if captured:
        print(f"\nBaseline saved: {len(captured)} frame(s) in {output_dir}")
    else:
        print(f"\nNo VRT frames found for {library_name}.")


def interactive_mode():
    """Interactive mode — paste a URL, get a report."""
    print("\n  Mistica VRT - Visual Regression Testing\n")

    url = input("Paste your Figma branch URL: ").strip()
    if not url:
        print("No URL provided.")
        sys.exit(1)

    file_key, branch_key = parse_figma_url(url)
    if not file_key:
        print("Could not parse Figma URL.")
        sys.exit(1)

    if not branch_key:
        print("This URL points to a main file, not a branch.")
        print("To compare, provide a branch URL.")
        sys.exit(1)

    library_name = detect_library(file_key)
    if library_name:
        print(f"Detected library: {library_name}")
    else:
        print(f"File key {file_key} doesn't match a known library (mobile/desktop).")
        print("Running diff with this file key anyway...\n")
        # Use mobile baselines as default for unknown files
        library_name = "mobile"

    run_diff(branch_key, library_name)


def cli_mode():
    """CLI mode with subcommands for scripting and GitHub Actions."""
    parser = argparse.ArgumentParser(description="VRT for Mistica Figma libraries")
    subparsers = parser.add_subparsers(dest="command", required=True)

    baseline_parser = subparsers.add_parser("save-baseline", help="Save current main as baseline")
    baseline_parser.add_argument("--library", required=True, choices=["mobile", "desktop", "both"])
    baseline_parser.add_argument("--file-key", help="Override Figma file key (for testing)")

    diff_parser = subparsers.add_parser("diff", help="Compare branch against baseline")
    diff_parser.add_argument("--branch-key", required=True, help="Figma branch key")
    diff_parser.add_argument("--library", required=True, choices=["mobile", "desktop", "both"])
    diff_parser.add_argument("--file-key", help="Override Figma file key (for testing)")

    args = parser.parse_args()

    if args.command == "save-baseline":
        libraries = ["mobile", "desktop"] if args.library == "both" else [args.library]
        for lib in libraries:
            run_save_baseline(lib, args.file_key)

    elif args.command == "diff":
        libraries = ["mobile", "desktop"] if args.library == "both" else [args.library]
        for lib in libraries:
            run_diff(args.branch_key, lib, args.file_key)


def main():
    # No arguments → interactive mode
    if len(sys.argv) == 1:
        interactive_mode()
    else:
        cli_mode()


if __name__ == "__main__":
    main()
