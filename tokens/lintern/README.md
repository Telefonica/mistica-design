# 🧪 Design Tokens Linter

A CLI tool to validate and enforce consistency, accessibility, and structure in our design tokens stored as JSON files.

## 🚀 Usage

### 1. Install dependencies

```
cd tokens/lintern

npm install
```

### 2. Run the linter

Option A: Choose file interactively

```
npm run lintern
```

You'll be prompted to select which JSON file to validate.

Option B: Pass a filename

```
npm run lintern my-tokens.json
```

This runs the validation directly on a specific file inside tokens/.

## ✅ What It Checks

🔹 Contrast Validation (WCAG AA/AAA)
Checks defined foreground/background pairs against accessibility contrast ratios.

🔹 Description/Reference Match
Ensures tokens referencing {palette.color} match their description field.

🔹 Invalid Palette References
Detects references to {palette.xxx} that do not exist in global.palette, helping to avoid broken tokens and runtime issues.

## 🛠 Customizing Pairs

You can edit contrast rules in lintern/contrastPairs.js:

```
export const contrastPairs = [
{ fg: "text.primary", bg: "background.default", minRatio: 4.5 },
...
];
```

## 📤 Output Example

```
🔍 Revisando my-tokens.json
✔ Todas las descripciones coinciden con la referencia en palette
[contrast-fail] light.text.primary vs light.background.default
Foreground: #767676 (gray700)
Background: #f5f5f5 (gray100)
Ratio: 3.55 < mínimo: 4.5

Resumen:

- Archivos revisados: 1
- Archivos con errores: 1
- Total errores: 1

```
