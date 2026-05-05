# 🧪 Design Tokens Linter

A CLI tool to validate and enforce consistency, accessibility, and structure in our design tokens stored as JSON files.

## 🚀 Usage

### 1. Install dependencies

```
cd tokens/linter

npm install
```

### 2. Run the linter

#### Option A: Interactive mode

```
npm run lint:tokens
```

You'll be prompted to pick a mode (format or contrast) and then a token file (or "All files").

#### Option B: Run a specific mode

```
npm run lint:tokens:format
npm run lint:tokens:contrast
```

- `format` mode: checks `description` ↔ `{palette.*}` reference matches and detects references to palette colors that don't exist. Skips gradient tokens.
- `contrast` mode: checks foreground/background pairs from `contrastPairs.js` for WCAG ratio compliance. Skips gradients and `rgba()` colors.

When run in CI (`CI=true` or `GITHUB_ACTIONS=true`), prompts are disabled and the linter defaults to `format` mode across all token files. Errors are emitted as GitHub Actions annotations.

#### Option C: Run against a single file or with a specific mode

The CLI accepts a `.json` filename and/or a mode as positional arguments. To forward args through `npm run`, use `--`:

```
npm run lint:tokens -- my-tokens.json format
npm run lint:tokens -- my-tokens.json contrast
```

Or invoke node directly:

```
node index.js my-tokens.json contrast
```

Token files are resolved relative to the parent `tokens/` directory.

## ✅ What It Checks

🔹 **Contrast Validation (WCAG AA / UI elements)**
Checks defined foreground/background pairs against accessibility contrast ratios for both `light` and `dark` themes. When a contrast failure is found, the linter suggests an alternative color from the same palette family that meets the minimum ratio.

🔹 **Description / Reference Match**
Ensures tokens whose value is `{palette.color}` have a `description` field equal to `color`.

🔹 **Invalid Palette References**
Detects references to `{palette.xxx}` tokens that do not exist in `global.palette`.

## 🛠 Customizing Pairs

Contrast rules are defined in `contrastPairs.js`. Each entry pairs one or more `fg` token names with one or more `bg` token names, plus a `minRatio`. Token names are flat (single-segment) and resolved against each theme (`light.<name>`, `dark.<name>`):

```js
export const contrastPairs = [
  {
    fg: ["textPrimary", "textSecondary"],
    bg: ["background", "backgroundContainer"],
    minRatio: 4.5,
  },
  // ...
];
```

## 📤 Output Example

```
🔍 mistica.json
  [contrast-fail] light.textPrimary vs light.background
    Suggestion: gray800 (#4A4A4A, 6.12)

❌ Validation failed with 1 errors
```

When run in CI, each error is also printed as a GitHub Actions annotation:

```
::error file=mistica.json::[contrast-fail] light.textPrimary vs light.background - Contrast 3.55 < 4.5
```
