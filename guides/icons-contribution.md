# Icons contribution guide

This guide describes the end-to-end process to add a new icon to the Mística Design System, from the initial issue to the final import in `mistica-web`.

The icon flow involves three repositories and two Figma libraries, so it is important to follow the steps in order to keep them in sync.

## Index

- [Process overview](#process-overview)
- [1. Create the issue](#1-create-the-issue)
- [2. Add the icon to the brand library in Figma](#2-add-the-icon-to-the-brand-library-in-figma)
- [3. Publish the brand library](#3-publish-the-brand-library)
- [4. Add the icon to the Mística Icons library in Figma](#4-add-the-icon-to-the-mística-icons-library-in-figma)
- [5. Sync icon keywords in Figma](#5-sync-icon-keywords-in-figma)
- [6. Run the Figma export action in mistica-icons](#6-run-the-figma-export-action-in-mistica-icons)
- [7. Review and merge the auto-generated PR](#7-review-and-merge-the-auto-generated-pr)
- [8. Import the icons in mistica-web](#8-import-the-icons-in-mistica-web)

## Process overview

```
   ┌──────────┐   ┌─────────────┐   ┌────────────────┐   ┌──────────────┐   ┌──────────────┐
   │  Issue   │ → │ Brand lib   │ → │ Mística Icons  │ → │ Sync         │ → │ figma-export │
   │ (GitHub) │   │ (Vivo, O2…) │   │ (Figma)        │   │ keywords     │   │ action       │
   └──────────┘   └─────────────┘   └────────────────┘   └──────────────┘   └──────────────┘
                                                                                    ↓
                                                         ┌──────────────────────────────────┐
                                                         │ Auto PR in mistica-icons → merge │
                                                         └──────────────────────────────────┘
                                                                                    ↓
                                                         ┌──────────────────────────────────┐
                                                         │ Import in mistica-web            │
                                                         └──────────────────────────────────┘
```

## 1. Create the issue

Open an issue in the `mistica-design` repository using the [Icon request template](https://github.com/Telefonica/mistica-design/issues/new?template=icon_request.yml).

The issue is automatically labeled with `fundamentals: icons` and `request ✨`.

## 2. Add the icon to the brand library in Figma

Each brand has its own Figma library where icons are designed and validated before they reach the unified Mística Icons library.

1. Open the corresponding brand library in Figma:
2. Create a new branch in the file.
3. Design the icon in all the variants the library supports (`light`, `regular`, `filled`). (Inside this file you have checks that must follow the icon construction)
4. Request the approval adding at least 2 members of the design ops team as reviewers of that branch.
5. Address any feedback and merge the branch when the review is approved.

## 3. Publish the brand library

Once the branch is merged, publish the brand library so the new icon is available for the next step.

> [!IMPORTANT]
> The brand library must be published **before** updating the Mística Icons library. Also important, the export action picks up icons from the main branch, not from branches.

## 4. Add the icon to the Mística Icons library in Figma

Mística Icons aggregates the icons from all brand libraries. The magic of multibrand system occurs here.

1. Open the [Mística Icons file](https://www.figma.com/design/JHuzksh01yxExMeMQBvymq/M%C3%ADstica-Icons).
2. Create a new branch in the file.
3. Add the icon component using the published asset from the brand library.
4. Request the approval adding at least 2 members of the design ops team as reviewers of that branch.
5. Merge the branch when approved.

## 5. Run the Figma export action in mistica-icons

Once the icon lives in Figma and the keywords JSON is up to date, the SVGs need to be pulled into the `mistica-icons` repository.

1. Go to the [Actions tab in mistica-icons](https://github.com/Telefonica/mistica-icons/actions).
2. Select the **🚀 Release (Figma)** workflow (`figma-export.yml`).
3. Click **Run workflow** and configure the inputs:
   - `brand`: the brand whose icons you want to export (`all`, `telefonica`, `o2`, `o2-new`, `blau`, `vivo`). Use `all` for full syncs.
   - `draft`: keep it as `true` unless the PR is ready to be reviewed immediately.
   - `branch`: leave the default (`import-figma-icons`) unless you need a specific branch name.
4. Run the workflow.

The action will:

- Export the SVGs from the configured Figma files for the selected brand(s).
- Commit any change to the target branch.
- Open (or update) a Pull Request against `production` titled "Update _brand_ icons" and including a link to review the updated `ICON_TABLE.md`.

## 6. Sync icon keywords in Figma

Each icon component in Figma carries a description with its keywords and a link to the documentation. These descriptions are kept in sync with the `icons-keywords.json` file in `mistica-icons` through the **Sync Icon Descriptions** Figma plugin.

Running the plugin to sync Figma with the JSON is **mandatory** so that the icons in Figma always reflect the latest descriptions. What is **optional** is filling the keywords by hand: if you don't, an AI will auto-generate them in the PR created by the export workflow (see [step 6](#6-run-the-figma-export-action-in-mistica-icons)).

The plugin source is in the `mistica-icons` repository:

- Path: `mistica-icons/.github/figma-plugins/sync-icons-keywords`
- Plugin reference: [Sync Icon Descriptions README](https://github.com/Telefonica/mistica-icons/tree/production/.github/figma-plugins/sync-icons-keywords)

### 6.1 Update the keywords source (optional)

> [!NOTE]
> This sub-step is optional. Skip it if you prefer the AI to generate the keywords during the export workflow.

1. In `mistica-icons`, edit `icons/icons-keywords.json` and add an entry for the new icon. Example:

   ```json
   "wifi-router": {
     "category": ["Telco and comms"],
     "keywords": ["router", "modem", "router wifi", "roteador", "router-wifi"]
   }
   ```

2. Open a PR with this change and merge it once approved. The JSON in the `production` branch is the source of truth that the Figma plugin reads.

### 6.2 Install the plugin in Figma (first time only)

1. Clone or download the `mistica-icons` repository.
2. In Figma, go to `Plugins > Development > New Plugin`.
3. Choose the `Manifest` option and select `mistica-icons/.github/figma-plugins/sync-icons-keywords/manifest.json`.

### 6.3 Run the plugin

1. Open the Mística Icons Figma file and navigate to the page that contains the icon components.
2. Run the plugin from `Plugins > Development > Sync Icon Descriptions`.
3. The plugin fetches the JSON from GitHub and updates the description of every component in the page (including nested ones) with the corresponding keywords and a link to the docs.
4. The plugin will display a summary of how many components were updated.
5. When everything looks correct, publish the Mística Icons library so the updated descriptions are available to consumers.

> [!TIP]
> If you need to debug the plugin, open the Figma console with `Cmd + Option + I` (macOS) or `Ctrl + Shift + I` (Windows). Logs include processed components and any errors.

## 7. Review and merge the auto-generated PR

When the workflow finishes, a PR is created (or updated) in `mistica-icons`.

1. Open the PR and review the changes:
   - Check the file diff to ensure the new icon files are present in the right brand folders (`icons/<brand>/<variant>/<icon>.svg`).
   - Open `ICON_TABLE.md` from the PR branch to visually verify all icons render correctly.
   - Make sure no existing icon was modified by mistake.
2. Request a review by adding at least one member of the design ops team as a reviewer.
3. If the PR is in draft, mark it as ready for review.
4. Merge the PR once it has the required approvals.

## 8. Import the icons in mistica-web

After the PR is merged in `mistica-icons`, the icons need to be imported into `mistica-web` to become available as React components.

The import script lives in `mistica-web`:

- Path: `mistica-web/packages/import-mistica-icons`

### 8.1 Run the import script

From the root of `mistica-web`:

```sh
cd packages/import-mistica-icons
yarn start
```

The script will:

- Clone (or update) the `mistica-icons` repository from the `production` branch into a local cache.
- Generate one React component per icon in `src/generated/mistica-icons/`. Each component supports skin variants (`telefonica`, `vivo`, `o2`, `o2-new`, `blau`) using the project's theme system.
- Generate `icons-keywords.tsx` from `icons-keywords.json`, exposing the `iconKeywords` and `iconCategories` maps.
- Write the export list for `src/index.tsx` to `src/generated/mistica-icons/index.tsx.txt`.

### 8.2 Update the public exports

Open `src/generated/mistica-icons/index.tsx.txt` and copy its contents into the matching section of `src/index.tsx` so the new icon is exported from the package.

### 8.3 Open the PR

1. Create a branch with the regenerated files and the updated `src/index.tsx`.
2. Open a PR in `mistica-web` describing the icons added or updated.
3. Follow the [mistica-web CONTRIBUTING guide](https://github.com/Telefonica/mistica-web/blob/master/CONTRIBUTING.md) for reviewers and release notes.

Once this PR is merged and a new version of `@telefonica/mistica` is published, the icon is available for product teams to consume.
