# Token Extended Guide

Although Mística tokens cover most of the needs a product may have in terms of color or other visual properties, there may be cases where specific tokens need to be created to address scenarios not covered by the default Mística skins.

## Implicit Logic in Mística Tokens

Mística tokens follow certain implicit rules:

- **Value by color scheme:**  
  For color tokens of this type, the token already contains logic for which value to use in light mode and dark mode.
- **Value by brand:**  
  Each token has a value for every supported brand in the system.

For this logic to work correctly:

- The number of tokens must be the same across all brands.
- Token names must be identical in all brands.

For these special cases, we suggest creating **extended tokens** and recommend following certain rules when doing so.

```
┌──────────────────┐
│ Brand Palette     │  ← Official brand colors + extra system colors
│ (no logic)        │
└─────────┬────────┘
       │
       ▼
┌──────────────────┐
│ Mística Tokens    │  ← Apply implicit logic
│ - Color-scheme    │     (light/dark values)
│ - Brand values    │
└─────────┬────────┘
       │
       ▼
┌──────────────────┐
│ Extended Tokens   │  ← Custom values for cases
│                   │     not covered by defaults
└──────────────────┘
```

---

## Mística Brand Palettes

In Mística, we offer **brand palettes**—a combination of the brand’s official palette and additional colors derived from it to cover system-specific cases (for example, a hover color).

These brand palettes have **no implicit logic**. Instead, they are used as a base to build color tokens in Mística.

For example:  
The `textPrimary` token might use `grey7` from the palette in one brand, while in another brand it could use `black`.

When building extended tokens, we recommend following the same strategy. Here’s an example:

---

### Example: Creating an Extended Token

I need a new token for my product because the `backgroundContainer` logic, when switching color schemes, doesn’t work as I designed it.

1. I create a new token: `{tokenExtendedName}`
2. Since the value in light mode works for me, I keep it as is.

- Light mode value: `{palette.white}`
- Dark mode value: instead of `{palette.darkModeGrey}`, I change it to `{palette.grey4}`

3. Now I have a token that uses the brand palette but has its own custom logic.
