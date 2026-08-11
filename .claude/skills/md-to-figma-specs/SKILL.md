---
name: md-to-figma-specs
description: "Generates visual Figma specs from a specs/<slug>.md file (the markdown produced by scripts/figma-spec). Trigger whenever the user wants a visual, Figma-native version of a component spec — e.g. 'turn specs/sidenav.md into a Figma spec', 'update the Figma spec for X', 'generate the visual spec for this component'. Builds or updates a page named 'Specs' inside the target Figma file using the shared template components (Section Header, Spec Layouts variant set), never freehand layout."
disable-model-invocation: false
---

# md-to-figma-specs

Converts a `figma-spec`-generated markdown file into a visual spec inside a
Figma file, using a fixed set of template components instead of freehand
layout. This is the reverse direction of `scripts/figma-spec` (which walks a
Figma page into markdown): this skill walks markdown back into Figma content.

**Why template-driven, not freehand:** every spec must look the same
(consistent headers, a fixed text-left/image-right layout, real tables) and
building a one-off layout with `use_figma`/`generate_figma_design` on every
run would both drift visually between components and burn tokens re-deriving
a layout that should be deterministic. The parsing step is pure code (no LLM
tokens); only the block→variant mapping decision uses judgment.

The visual language (breadcrumb + big section title, text always on the
left with the figure always on the right, thin dividers between blocks)
follows the convention observed in Mística's own hand-built spec decks, e.g.
`https://www.figma.com/design/X7I9t1mfcIHCZGuXozD8D5/🔸-Timeline-Specs` —
minus their hand-drawn measurement-redline annotations, which are bespoke
design work per component and out of scope for this skill; it embeds the
plain PNG figures from `specs/<slug>/figures/` instead.

Load `figma-use` (and `figma-generate-library` if creating new component
variants) before any `use_figma` call this skill makes. Batch-load Figma MCP
tool schemas in one `ToolSearch` call: `select:use_figma,get_metadata,get_screenshot,create_new_file,upload_assets`.

## 0. Reference template

The canonical components live in
`https://www.figma.com/design/CuJtuYfo6QOSuIRMUBkXVV/Untitled?node-id=0-1`
(page "Template"). Treat this file as the design source of truth to inspect
when in doubt about typography, color, or spacing — **not** as something to
copy cross-file. The Figma Plugin API has no supported cross-file node-copy
operation, so instead of duplicating this file, every target file/page gets
its own instances of the *same* components, built by the reusable script in
[Section 3](#3-bootstrap-a-specs-page). Component IDs as of this writing:

| Component | ID | Notes |
|---|---|---|
| `Spec Template` (master) | `0:77` | Page header + body slots. Reference only — don't instance across files. |
| `Specs Header` (instance inside Spec Template) | nested under `0:88` | Logo + "Project" label + big Title. |
| `Section Header` | `6:46` | Doubles as each section artboard's own page title: small breadcrumb ("Mística Design System · `<Title>`") + big bold title (same 56px/64 scale as the Cover title) + divider. Standalone component, not part of the variant set. |
| `Spec Layouts` (component set) | `0:89` | Variant property `Layout` = `Text \| Image` \| `Image \| Text` \| `Text only` \| `Table`. |

## 1. Parse the markdown

```sh
npm --prefix scripts/md-to-figma run parse -- /absolute/path/to/specs/<slug>.md --pretty
```

Returns a `SpecDocument` (see `scripts/md-to-figma/README.md` for the exact
shape): a title, and an ordered list of H2 sections each containing blocks
(H3/H4 heading + prose + optional figure + optional table).

## 2. Decide the target

Ask for or infer these inputs before writing anything:

- **No Figma link given** → this is a brand-new component spec. Use
  `create_new_file` (figma:figma-create-new-file skill) to make a blank
  design file, name it `<Title> — Specs`, then proceed as case 2 below on
  that new file.
- **Link given, file has no page named `Specs`** → create the page, then
  bootstrap it (Section 3) and populate it (Section 4).
- **Link given, file already has a page named `Specs`** → read its current
  content (Section 5) and diff against the freshly parsed markdown, updating
  only what changed (Section 5).

Never guess a `fileKey`/page — if the user's link is ambiguous or the page
name doesn't match exactly, ask.

## 3. Bootstrap a `Specs` page

A fresh `Specs` page is a set of independent top-level frames (artboards) on
the page — **not** one shared auto-layout column. Each section gets its own
frame so it stays separately selectable/exportable in Figma:

1. A `<Title> — Cover` frame containing the page-level title, built the same
   way as `Specs Header` (logo row + `SpecDocument.title` as the big Title
   text) — mirror the structure at `0:117`/`0:88` (see Section 0 table)
   rather than importing it, per the cross-file constraint above.
2. One `<Title> — <Section heading>` frame per
   `SpecDocument.sections[i].heading` (skip if the section has zero blocks —
   this happens for e.g. an empty `Animation` H2), each a vertical
   auto-layout frame, width `1584`, padding `64/80/80/80`
   (top/right/bottom/left), white fill, containing a `Section Header`
   instance as its first child.
3. Under each frame's Section Header, one row per block (Section 4 decides
   which `Spec Layouts` variant each block becomes).
4. Position frames in a single row at `y = 0`, left to right by cumulative
   width with a 120px gap, in section order, cover first. All frames share
   the same fixed width (`1584`), so — unlike a vertical stack — a later
   frame's `x` never needs to shift when an earlier frame's height changes
   from populating it. Compute `x` once during skeleton creation and leave
   it fixed.

Work incrementally per the `figma-use` skill: build the page skeleton first
(cover + empty section frames, positioned left to right) with
`placeholder = true` on each section, validate with `get_metadata`, then
fill sections one `use_figma` call at a time, clearing the placeholder flag.
Do not attempt an entire multi-section spec in one call.

## 4. Map a block to a variant

For each `SpecBlock`, decide how many rows it becomes — **a block with both
a figure/prose AND a table becomes two rows**, since no single variant
represents both:

| Block shape | Row(s) |
|---|---|
| `figures.length > 0` | One `Text \| Image` row — **always this side, never `Image \| Text`.** Matching the Timeline Specs convention (see above), text stays on the left and the figure on the right in every row, with no alternation. Title = `block.heading`, body = `block.body.join('\n')` (hide the body text node if empty — this covers figure-with-no-prose blocks, e.g. Typology's `Default`/`Boxed`). |
| `figures.length === 0` and (`body.length > 0` or `table` present) | One `Text only` row — title = `block.heading`, body hidden if empty. This covers table-only blocks that still need their heading labeled (e.g. Tokens' `Default`, `Footer` sub-blocks, which have a table but no prose or figure). |
| `figures.length === 0` and `body.length === 0` and no `table` (heading-only block, e.g. "You can view the full MainNavBar specs here") | Skip — no content to render. |
| `table` present | An additional `Table` row, always placed immediately after the block's prose/figure/text-only row. |

Between each block's row-group (but not before the first one, which already
sits under the Section Header's own divider), insert a thin full-width
`Divider` rectangle (same style as the Section Header's) to mark the block
boundary, matching the Timeline Specs row rhythm.

If a block has more than one figure, only the first is used for v1 — flag
this to the user rather than silently dropping the rest, since it comes up
in a few `sidenav.md` blocks (e.g. "Item with children" shows a with-asset
and without-asset variant side by side).

To create a row: get the `Spec Layouts` component set (`0:89`), find the
child whose `name` matches `Layout=<Variant>` (`Text | Image`, `Text only`,
or `Table` — `Image | Text` exists in the set for historical reasons but is
no longer used by this skill), call `.createInstance()`, append it under the
section, then edit its text children's `characters`
(after loading their current font — see the `figma-use` canonical text-edit
recipe) and, for image rows, set the image fill via `upload_assets` (do
**not** use `createImageAsync` — it is unsupported in this environment). For
`Table` rows with a row count different from the master's 1-header + 2-data
default, `detachInstance()` first, then add/remove row frames by cloning the
existing `Row` frame — a plain instance cannot gain or lose children.

**Correct the image rectangle's height to the figure's real aspect ratio —
never leave it at the master's fixed 230px.** The `Text | Image` image
rectangle is authored at a fixed height (230px at the master's native width,
~684px wide once `layoutSizingHorizontal = 'FILL'` stretches the row), but
every figure PNG has its own aspect ratio; uploading at `scaleMode: 'FILL'`
into that fixed box silently crops whatever doesn't match ~2.95:1 (a portrait
screenshot like `anatomy-sidenav-regions.png` gets cropped down to a thin
horizontal strip). Get each figure's real pixel size locally (e.g. `sips -g
pixelWidth -g pixelHeight <file>.png`), then after the row exists, resize its
image rectangle to `rect.width * (naturalHeight / naturalWidth)` and grow the
row frame to `Math.max(innerFrame.height, rect.height)` so neither the text
column nor the image gets clipped. This can be done as a follow-up pass over
all image rows in one `use_figma` call — resizing the rectangle after upload
is enough, since `FILL` scale mode recomputes the crop live and there is no
need to re-upload the asset.

## 5. Diffing an existing `Specs` page

Do not use `setPluginData` (unsupported here). Instead, after populating each
row, set a content hash into that row's own `description` field, e.g.
`description = "md-to-figma:sha1=<hex>"`, hashing the block's `heading` +
`body` + `figures` + `table` together. On a re-run:

1. Parse the markdown again (Section 1).
2. Walk the existing `Specs` page's Section Header and row instances by name
   (`Section Header`, `Layout=<Variant>` instances) in canvas order.
3. For each block, compute the same hash and compare to the existing row's
   `description`. Unchanged → skip. Changed → update that row's content in
   place. New block with no matching row → insert a new row after its
   section's last existing row. Row with no matching block anymore → remove
   it.

This keeps re-runs cheap (only the changed rows are touched) and avoids
regenerating a whole page's content on every markdown edit.

## Known gaps to flag when using this skill

- The `Table` variant currently uses placeholder typography (`SF Pro Text`,
  hardcoded colors) rather than real Mística tokens, matching its
  `Text | Image` / `Image | Text` siblings — none of the `Spec Layouts` set
  is token-bound yet. Mention this to the user; fixing it is a separate,
  explicitly-requested pass, not implied by running this skill.
- Multi-figure blocks only render their first figure (see Section 4).
- Inline formatting (bold/italic spans, links) inside prose is flattened to
  plain text by the parser.
