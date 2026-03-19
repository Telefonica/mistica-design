# Mistica Scripts

## Compare Components

Compares the components in a Figma library (main file) against a Figma branch, generating a report of what changed.

### Setup

```bash
cd scripts
npm install
```

Requires a `FIGMA_TOKEN` in the root `.env` file:

```
FIGMA_TOKEN=your_figma_personal_access_token
```

### Usage

```bash
npm run compare
```

The script will prompt you to:

1. **Choose a library** — Desktop, Mobile, or Custom (provide your own file key/URL)
2. **Enter the branch** — paste a Figma branch URL or file key

You can paste full Figma URLs in either format:

```
https://www.figma.com/design/FILE_KEY/branch/BRANCH_KEY/Title
https://www.figma.com/design/FILE_KEY/Title?branch-id=BRANCH_KEY
```

Or just the raw branch file key.

### Output

Reports are saved to `.figma-reports/` (gitignored):

- **JSON** — full structured data with all component details
- **Markdown** — human-readable report

### What the report covers

| Section | Description |
| --- | --- |
| **Renamed / Moved** | Components with the same node ID but different name. Variant renames are consolidated at the component set level showing the property that changed |
| **Modified** | Components with changes to description, variant count, child count, or properties. New/removed variants in an existing component set appear here (not as added/removed) |
| **Added** | Truly new components that don't exist in the main file |
| **Removed** | Components that exist in main but are missing from the branch |

### How comparison works

- Components are matched by **Figma node ID**, which is preserved across renames
- If a variant is renamed, it's detected as a rename (not a remove + add)
- New variants added to an existing component set are shown as a modification of that component set, with a summary of the distinguishing property (e.g. `Theme context=Negative`)
- Property renames across variants are consolidated into a single entry at the parent level

### Preconfigured libraries

| Name | File key |
| --- | --- |
| Mistica Desktop | `DSWhPLyJzbliP1fBrLxDUR` |
| Mistica Mobile | `WCkDDzlXE16R6yXaljxddj` |
