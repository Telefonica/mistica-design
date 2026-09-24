# VRT — Visual Regression Testing for Figma

Compare Figma branches against the main library to see what changed visually.

## Setup (once)

```bash
pip3 install -r scripts/vrt/requirements.txt
```

Make sure your `.env` file at the repo root has a valid `FIGMA_TOKEN`.

## Compare a branch

Run the script and paste your Figma branch URL:

```bash
python3 scripts/vrt/vrt.py
```

```
Paste your Figma branch URL: https://www.figma.com/design/.../branch/.../...

Detected library: mobile
Diffing branch against mobile baseline...
Found 12 VRT frames. Rendering PNGs...

Summary: 3 changed, 1 added, 0 removed, 8 unchanged
Report opened in browser.
```

The library (mobile/desktop) is auto-detected from the URL. A report opens in the browser showing three columns for each changed component: **Baseline**, **Branch**, and **Diff** (with changes highlighted in red).

## Update baseline

After merging a Figma branch into main, update the baseline so future comparisons are accurate:

```bash
python3 scripts/vrt/vrt.py save-baseline --library mobile
python3 scripts/vrt/vrt.py save-baseline --library desktop
python3 scripts/vrt/vrt.py save-baseline --library both
```

This captures all VRT frames from the main file and saves them to `baselines/`. Commit and push the updated PNGs.

## How VRT frames work in Figma

For the tool to work, component pages in the Figma libraries need frames with names starting with **`VRT`**.

### Naming

- `VRT - Button Primary`
- `VRT - Checkbox`
- `VRT - Card - Aspect Ratio 1:1`

Any frame, component, or instance whose name starts with `VRT` will be captured.

### What to put inside

Each VRT frame should contain component instances showing all relevant visual states — toggle booleans on, show variants, etc. The goal is to capture everything that matters visually so changes don't go unnoticed.

### Supported libraries

| Library | Figma file |
|---------|-----------|
| Mobile  | `WCkDDzlXE16R6yXaljxddj` |
| Desktop | `DSWhPLyJzbliP1fBrLxDUR` |

## CLI reference

```bash
# Interactive mode — paste a URL, get a report
python3 scripts/vrt/vrt.py

# Save baseline
python3 scripts/vrt/vrt.py save-baseline --library mobile|desktop|both

# Diff a branch (non-interactive)
python3 scripts/vrt/vrt.py diff --branch-key <KEY> --library mobile|desktop|both

# Override file key (for testing with other Figma files)
python3 scripts/vrt/vrt.py save-baseline --library mobile --file-key <FILE_KEY>
python3 scripts/vrt/vrt.py diff --branch-key <KEY> --library mobile --file-key <FILE_KEY>
```
