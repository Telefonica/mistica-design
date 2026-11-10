# VRT Workflow for Designers

This document describes how to use Visual Regression Testing (VRT) to catch visual changes when updating Mística components.

## 1. Setup

Before you can run VRT, the Python environment and Figma token need to be configured (one-time setup):

```bash
# Install dependencies
pip3 install -r scripts/vrt/requirements.txt

# Verify setup works
python3 scripts/vrt/vrt.py --help
```

A valid `FIGMA_TOKEN` must be in the repo root's `.env` file (ask your team if you don't have this).

## 2. Launch VRT to See Changes

When you want to compare your branch changes against the current main library:

1. **Create a Figma branch** and make your component changes
2. **Add VRT frames** — In your branch, create frames named `VRT - [Component Name]` that contain the component instances you want to test
3. **From the repository root, run:**

```bash
python3 scripts/vrt/vrt.py
```

4. **Paste your Figma branch URL** when prompted:

```
Paste your Figma branch URL: https://www.figma.com/design/.../branch/.../...
```

5. **A report opens automatically** with a three-column comparison:
   - **Baseline** — Current main library
   - **Branch** — Your changes
   - **Diff** — Visual differences (red = changed)

## 3. Add or Update VRT Frames

When you modify a component or add a new one, update its VRT frame:

1. **In your Figma branch**, find or create the VRT frame for that component
2. **Name it** `VRT - [Component Name]` (e.g., `VRT - Button Primary States`)
3. **Add component instances** showing all the visual states you want to test:
   - Default, hover, active, disabled states
   - Different sizes or variants
   - Edge cases (full text, truncated text, etc.)
4. **Run VRT** to see how your changes compare to the baseline
5. **If changes look wrong**, iterate in Figma and run VRT again
6. **When changes look correct**, you're ready to merge

## 4. Update Baseline After Merging

Once your branch is merged into main, a developer must update the baseline so future VRTs use the new main as reference:

```bash
# From repository root
python3 scripts/vrt/vrt.py save-baseline --library mobile

# Or for desktop
python3 scripts/vrt/vrt.py save-baseline --library desktop

# Or both at once
python3 scripts/vrt/vrt.py save-baseline --library both
```

This captures all VRT frames from the current main file and saves them as the new baseline. The files should get committed and pushed to the `production` branch.
