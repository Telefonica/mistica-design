---
name: update-tokens
description: Edit Mistica token JSON files when the user requests new tokens, color, spacing, text, radius, changes in skin, or new brand tokens or skins.
---

# Token Editor

This skill is used to modify Mistica design tokens JSON files in a controlled and consistent way.

---

## When to use

Use this skill **only** when the user explicitly requests:

- Adding a new token
- Editing an existing token
- Creating a new brand / skin
- Modifying token values or descriptions

Do not use this skill for:

- UI implementation
- Token usage in application code
- Guessing, proposing, or inventing new tokens without explicit request

### Execution flow

When this skill is invoked, follow this order strictly:

1. Identify the exact user request (token name, type, brand)
2. Locate the affected files:
   - Brand file(s)
   - Schema file (if adding or removing tokens)
   - contrastPairs.js (if color tokens affect contrast)
3. Apply the minimal required change
4. Validate structure consistency across brands
5. Update schema file
6. Update linter if impacted
7. **If new constants were added to `global.constants.required`**: remind the user that a paired PR in [mistica-web](https://github.com/Telefonica/mistica-web) is required to update `src/skins/skin-contract.css.ts`. The `check-token-import` CI workflow will block the mistica-design PR until those tokens appear in the contract file.
8. Summarize the changes made

---

## Token file structure

- Tokens live in the `tokens/` directory
- Brand files are named: `<brand>.json`
- Schema file: `tokens/schema/skin-schema.json`
- Linter contrast pairs live in `tokens/linter/contrastPairs.js`

Each brand file must define **the same token structure**:

- `light`
- `dark`
- `radius`
- `text`
- `spacing`
- `themeVariant`
- `componentProperties`

May differ between brands:

- Token values
- `global.palette` definitions

Token **keys and structure must always match across brands**.

---

## Editing rules (mandatory)

### General

- Never invent tokens not requested by the user
- Do not create new token types unless explicitly specified by the user
- Never remove existing tokens unless explicitly requested
- Keep JSON formatting consistent with existing files
- Apply **minimal diffs**: change only what is required
- Do not reorder unrelated tokens
- All brand failes should follow the structure enforced in `tokens/schema/skin-schema.json`

---

## Adding or editing tokens

### Color tokens

- Must exist in **both** `light` and `dark`
- Values must reference `global.palette`, if the have alpha `rgba({global.palette}, alphaValue)`
- Token `description` must exactly match the palette reference
- Do not use raw hex, rgb, or rgba values
- Insert new tokens after the closest existing token name (alphabetical proximity)

---

### Text tokens

- A new `text.size` token **must** also define `text.lineHeight`

## Schema updates

- The schema file **must** be updated when new tokens are added
- Schema structure must exactly match the brand token structure
- New `global.palette` tokens must be added per brand and included under the corresponding pattern in `definitions/constantProperties/patternProperties`
- Do not modify schema entries unrelated to the change

---

## Linter contrastPairs updates

- Update existent or create a new contrast pair if needed

Do not update contrast pairs for:

- Media-specific tokens
- Tokens using alpha
