---
name: mistica-playroom
description:
  Write JSX code in Mistica's hosted Playroom web editor (https://mistica-web.vercel.app/playroom) through a
  connected browser. Use this skill whenever producing or typing code into the Playroom web app, prototyping
  Mistica components live in the browser, or when the user is on the mistica-web.vercel.app/playroom page and
  asks to build, edit, or fix a Playroom example. Triggers on mentions of Playroom, mistica-web.vercel.app, or
  prototyping Mistica UI in the browser.
license: MIT
metadata:
  author: telefonica
  version: '1.0.0'
---

# Mistica Playroom (web editor)

Playroom is Mistica's hosted live-prototyping tool at **https://mistica-web.vercel.app/playroom**. The left
panel is a code editor; the right panel renders the result instantly across the configured widths. This skill
covers the peculiarities of writing code into that editor through a connected browser, so the code renders
on the first try.

## When to apply

- The user is on, or asks you to open, `https://mistica-web.vercel.app/playroom` and write or edit code.
- Prototyping a Mistica component, screen, or interaction live in the browser (not in a local repo).
- Mobile/desktop variants of the URL also apply: `/playroom-mobile` and `/playroom-desktop`.

## Pair with the `mistica-react` skill (design-system fidelity) — mandatory

The JSX written here must be as faithful to the Mistica design system as production code. This skill has a
**hard dependency on the `mistica-react` skill** for every component-choice, prop, and token decision — do not
generate component code without it.

**Preflight: confirm `mistica-react` is available (do this before generating any component code, right after
the browser-control preflight above).**

1. Check whether `mistica-react` is listed among the skills available in the current session.
2. **If it is available**, invoke it via the Skill tool and use it as the source of truth for: which component
   to pick for each UI need, valid props and variants, layout primitives, spacing tokens, color tokens, and
   accessibility expectations.
3. **If it is not available**, stop before generating any component code. Tell the user `mistica-react` is
   missing and offer to help them install it (e.g. via the `find-skills` skill or their plugin marketplace).
   Only fall back to generating JSX from general Mistica knowledge if the user explicitly asks to proceed
   without it, and flag in your reply that design-system fidelity was not verified against the skill.

Precedence when the two skills disagree: `mistica-react` governs *what* to build (component choice, props,
tokens, patterns); **this skill governs *how* the code must be shaped to run in Playroom** and always wins on
the Playroom-specific mechanics below. Concretely, take the design-system guidance from `mistica-react` but
then strip anything Playroom forbids:

- Remove all `import` lines — every Mistica export is already in scope here.
- Remove `export` / component-function wrappers / top-level `return` — emit a bare JSX expression.
- Replace `React.useState`/`useEffect` with the injected `getState`/`setState` helpers.
- Replace `useDialog()` usage with the injected `alert`/`confirm`/`dialog`/`showSheet` globals.
- Drop any hand-added `ThemeContextProvider`/`SheetRoot` — the frame already provides them.
- Use the in-scope `colors`/`skinVars` tokens instead of hardcoded color values, exactly as `mistica-react`
  recommends.

## Preflight: confirm browser control (do this first)

This skill drives the live web editor, so it requires a connected browser-control tool. **Before writing or
sending any code, verify that browser control is available.** Do not assume it is.

1. Check for a browser-control tool in the current session. Look for tools such as `Claude in Chrome`
   (`mcp__Claude_in_Chrome__*`, e.g. `list_connected_browsers`, `navigate`), `Control Chrome`
   (`mcp__Control_Chrome__*`), or a preview/browser tool that can open a URL and read the page.
2. Run one lightweight, read-only probe to confirm the connection actually works — for example list the
   connected browsers or read the current tab. A tool merely being listed is not proof it is connected; the
   probe must succeed.
3. **If the probe succeeds**, proceed to "How the editor works" below.
4. **If no browser-control tool exists, or the probe fails**, stop and do not pretend to type into the editor.
   Take both of these steps:
   - **Ask the user to enable browser control.** Point them to the Claude for Chrome extension (or their
     browser-MCP connector), and tell them to connect it to the active tab on
     `https://mistica-web.vercel.app/playroom`, then say "ready" so the probe can be retried.
   - **Provide a manual fallback in the meantime.** Output the complete Playroom JSX in a single fenced code
     block, following all the Hard rules below, and instruct the user to select-all in the Playroom editor and
     paste it. This way the user is never blocked even without browser access.

Re-run the probe after the user reports the connection is ready; only then continue with the automated flow.

## How the editor works (browser flow)

1. Open the URL. The editor area is a CodeMirror text field; the preview renders to the right.
2. To set the code, **replace the whole editor contents** rather than appending — Playroom encodes the current
   code into the URL hash, so partial typing can fight with existing content. Select-all then type/paste the
   full JSX.
3. The preview updates live. If nothing renders or an error overlay appears, re-read the code against the
   rules below — the usual cause is an `import`, an `export`, or a `React.useState` call.
4. Use the frame controls (skin tabs, iOS/Android, light/dark) to check the example across themes; do not bake
   a theme into the code.
5. The current example is shareable via the page URL (the code lives in the URL hash) — capture it when the
   user wants to save or share the prototype.

## Hard rules — why Playroom code differs from normal React

Playroom evaluates the editor content as a **single JSX expression** inside a frame that already mounts the
theme provider, `SheetRoot`, and overscroll provider. Consequences:

1. **No imports, ever.** Every Mistica component, icon, and imperative API is already in scope. Write
   `<ButtonPrimary>`, `<Text3>`, `<IconLightningRegular />` directly. An `import` line breaks the editor.

2. **No `export`, no `function`/component declarations, no `return`.** The code *is* the JSX. Begin with a tag
   or a fragment. To render multiple siblings at the top level, wrap them in a fragment `<>...</>`.

3. **No React hooks.** `React.useState` / `useEffect` do not work in a bare expression. Use the injected state
   helpers below for any interactivity.

4. **Do not add a theme provider or `SheetRoot`.** The frame provides them. Skin, platform, and color scheme
   are switched by the on-page controls — never hardcode a theme wrapper.

## Injected globals (available with no import)

State (the replacement for `useState`):

- `getState(key, defaultValue?)` — read persisted state.
- `setState(key, value)` — write state. It is **curried** and event-aware: `setState('foo')` returns a
  handler, and when handed a DOM event it extracts `currentTarget.checked` (checkbox) or `currentTarget.value`.
- `resetState(...keys)` — clear given keys, or all state when called with no arguments.

Theme / tokens:

- `colors` (= `skinVars.colors`), `rawColors` (= `skinVars.rawColors`), `theme` (full theme object). In
  Playroom use the in-scope `colors.brand`, not `skinVars.colors.brand`.

Imperative dialogs / sheets (already wired to the frame's `SheetRoot` — do **not** call `useDialog()`):

- `alert({title, message, acceptText})`
- `confirm({title, message, destructive?, acceptText?})`
- `dialog({title, message, asset?, link?, extra?, showCancel?})`
- `showSheet({type, props})`

Screen size flags: `isMobile`, `isTablet`, `isTabletOrBigger`, `isTabletOrSmaller`, `isDesktopOrBigger`,
`isLargeDesktop`, `isExtraLargeDesktop`.

Icon metadata: `iconKeywords`, `iconCategories`.

## Patterns

Open/close with state:

```jsx
<>
  <ButtonPrimary onPress={() => setState("openDrawer", true)}>Open Drawer</ButtonPrimary>
  {getState("openDrawer", false) && (
    <Drawer title="Title" onClose={() => setState("openDrawer", false)}>
      <Placeholder height={300} />
    </Drawer>
  )}
</>
```

Curried `setState` as an onChange handler (no wrapper arrow needed):

```jsx
<TextField
  name="search"
  label="Search"
  value={getState('search') ?? ''}
  onChangeValue={setState('search')}
/>
```

Persisted tab selection:

```jsx
<Tabs
  selectedIndex={getState('selectedTab', 0)}
  onChange={setState('selectedTab')}
  tabs={[{text: 'One'}, {text: 'Two'}]}
/>
```

Imperative dialog:

```jsx
<ButtonPrimary
  onPress={() => dialog({title: 'Title', message: 'Message', asset: <IconInformationUserLight color={colors.brand} />})}
>
  Open dialog
</ButtonPrimary>
```

## Useful conventions

- For filler content use the `Placeholder` component (e.g. `<Placeholder height={300} />`).
- For example media, a plain public image/video URL works (e.g. a `picsum.photos` image URL).
- Compose layouts with Mistica primitives (`Box`, `Stack`, `Inline`, `ResponsiveLayout`) rather than raw
  `div` + inline styles, so spacing and theming stay correct.

## Self-check before declaring done

- `mistica-react` availability was checked before generating component code; if missing, the user was offered
  help installing it rather than silently skipping it.
- The `mistica-react` skill was consulted for component choice, props, and tokens; the result is
  design-system-faithful and then adapted to Playroom's mechanics.
- No `import` / `export` / `function` / top-level `return` in the code.
- Any interactivity uses `getState`/`setState`, not `React.useState`.
- No `ThemeContextProvider` / `SheetRoot` wrapper added by hand.
- The preview panel renders without an error overlay; the example looks correct after toggling skin and
  light/dark in the on-page controls.
- If browser control was unavailable, the full JSX was delivered as a single paste-ready code block and the
  user was told how to enable browser control.
