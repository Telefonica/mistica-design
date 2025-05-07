# Mística SkinTool

## Project Goal
To provide an intuitive tool for creating and previewing custom brand skins efficiently using Mística.

## Project Overview
Mística SkinTool enables users to customize colors, typography, and borders for brand skins. It features a multi-step flow, real-time previews, localStorage persistence, and JSON export capabilities.

## File Descriptions and Next Steps

### `Theme.js`
- **Purpose**: Provides a theme context for Mística components, merging custom `themeColors` with defaults to define a comprehensive palette, border radii, and text presets.
- **Specific To-Dos/Fixes**:
  - Address doubts: palette variable names can be changed? (e.g., `movistarBlue` ), for colors that vary (e.g., `selectedColor`), what name should be used?
- **Next Steps**:
  - Extend to accept `typography` and `borderRadius` props for full customization.
  - Map user colors to `darkModeColors` for dark mode support.
  - Optimize palette generation for performance.

### `storageUtils.js`
- **Purpose**: Manages localStorage with keys, defaults, and utilities to persist and retrieve skin configurations, generating a final JSON config.
- **Specific To-Dos/Fixes**:
  - Decide if `DEFAULT_VALUES` should include all variables (recommended for completeness) or only user-editable ones (current approach).
  - In `generateSkinConfig`, clarify if all color variables should be returned (full palette) or just user-selected ones (current subset).
- **Next Steps**:
  - Add error handling for incomplete configs in `generateSkinConfig`.
  - Support versioning in exported JSON (e.g., `"version": "1.0"`).
  - Optimize storage calls (e.g., batch updates).

### `ThemePreviewWithTools.js`
- **Purpose**: Allows previewing and customizing a theme’s colors, typography, and borders, persisting colors in localStorage and exporting as JSON.
- **Specific To-Dos/Fixes**:
  - Convert custom dialog and components (e.g., `ColorDialog`, `ColorBox`) to Mística’s `Dialog` and existing components where possible.
- **Next Steps**:
  - Add “Typography” and “Border” tabs for full customization preview.
  - Integrate undo/redo buttons in the navigation bar.
  - Add a dark mode toggle in the “Preview” tab.

### `getColorScale.js`
- **Purpose**: Generates a color scale from a base HEX color by converting to HSL, adjusting lightness, and returning HEX values for UI use.
- **Specific To-Dos/Fixes**:
  - Simplify shading: Adapt scale based on color brightness (e.g., more light shades for dark bases, more dark shades for light bases).
- **Next Steps**:
  - Add unit tests for edge cases (e.g., `#000000`, invalid HEX).
  - Optimize algorithm for faster execution.
  - Support custom scale steps (e.g., adjustable `darkCount`/`lightCount`).

### `ColorDialog.js`
- **Purpose**: A modal for editing color names and values within `ThemePreviewWithTools`, with save/cancel options.
- **Specific To-Dos/Fixes**:
  - Adapt to Mística’s `Dialog` or `Drawer` component for consistency and built-in features.
- **Next Steps**:
  - Add HEX validation with error feedback.
  - Enhance accessibility with ARIA labels (e.g., “Edit color name”).
  - Improve responsiveness for smaller screens.
  - Improve UI when selecting color input.

### `SkinTool.js`
- **Purpose**: The entry point, offering options to start a new skin or remix an existing one.
- **Specific To-Dos/Fixes**:
  - Improve UI: Add a decorative or interactive mockup to illustrate platform functionality.
- **Next Steps**:
  - Add an intro modal with a tutorial and “Get Started” CTA.
  - Implement “Import Skin” with file input.
  - Create "Remix with existing skin" behaviour.
  - Enhance mobile responsiveness.

### `CreateColor.js`
- **Purpose**: The first step, enabling color palette definition with pickers, persisting selections in localStorage, and navigation.
- **Next Steps**:
  - Add section headers (e.g., “Primary”, “Feedback”) and tooltips.
  - Validate HEX codes and debounce color updates.

### `CreateTypo.js`
- **Purpose**: The second step in the flow, allowing font and weight selection with a preview, persisting choices in localStorage.
- **Specific To-Dos/Fixes**:
  - Convert custom components (e.g., weight buttons) to Mística equivalents (e.g., `Button` with custom styling).
- **Next Steps**:
  - Add a preview toggle for all weights of the selected font.
  - Include font info and use case labels (e.g., “Bold: Headlines”).
  - Enhance accessibility with keyboard navigation and focus styles.

### `CreateBorder.js`
- **Purpose**: The third step, allowing border radius customization and rounded button toggling with a preview grid.
- **Specific To-Dos/Fixes**:
  - Fix rounded borders not appearing (ensure `borderRadius` applies correctly in `CardWrapper`).
  - Fix button roundness when checkbox is unselected (correct `button` radius logic in `customTheme`).
  - Finalize `borderRadiusValues` for “Ultra Soft”, “Soft”, “Square” (adjust from placeholders `[32, 24, 0]`).
- **Next Steps**:
  - Integrate with `ThemePreviewWithTools` for consistent preview.

### `OnboardingComplete.js`
- **Purpose**: The final screen, showing a celebratory message with confetti, marking flow completion, and transitioning to advanced tools.

## Next Steps for SkinTool
1. **Beta Release**: Implement core UI/UX improvements (e.g., onboarding, navigation) and fixes (e.g., border issues, component conversions).
2. **Iteration**: Test with users, refine based on feedback (e.g., copy, bugs).
3. **Feature Expansion**: Add dark mode, enhanced import/export, and collaboration features.
4. **Production Release**: Finalize accessibility, performance, and deploy with testing/docs.