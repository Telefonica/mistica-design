# figma-spec

Generates Markdown specifications from Figma component documentation pages.

This tool walks the spec sections on a Figma page and produces a single Markdown
file per component under `specs/` at the repo root. Generated `.md` files are
manually reviewed and committed by the designer.

> **Status:** Phase 3 — H2 sections, H3 prose, inline figures, and tables via
> OCR (Gemini 2.5 Flash with a Tesseract fallback).

## One-time setup

1. **Install Node 20+** (native `fetch` is required).
2. **Install dependencies:**
   ```sh
   cd scripts/figma-spec
   npm install
   ```
3. **Set `FIGMA_TOKEN`.** A personal access token with read access to the
   relevant Figma files. The CLI reads `<repo>/.env` first, then
   `scripts/figma-spec/.env` (without overriding). Either location works:
   ```env
   FIGMA_TOKEN=figd_xxx
   ```
4. **(Optional, for tables) Set `GEMINI_API_KEY`** for Gemini 2.5 Flash OCR.
   Without it, table extraction falls straight through to the local
   `tesseract` binary, and then to an HTML-comment placeholder if that fails
   too.
5. **(Optional, for fallback OCR) Install `tesseract`.** On macOS:
   ```sh
   brew install tesseract
   ```
   Verify with `tesseract --version`.

## Add a component

Edit `scripts/figma-spec/specs.config.json` and add an entry under
`components`:

```json
{
  "outputDir": "specs",
  "components": {
    "sidenav": {
      "fileKey": "ABC123abc",
      "pageId": "12:34"
    }
  }
}
```

To find `fileKey` and `pageId`, copy the URL of the Figma page:

```
https://www.figma.com/design/<fileKey>/<fileName>?node-id=<pageId>
```

`pageId` from the URL uses `-` (e.g. `12-34`); the CLI normalizes it to `12:34`
automatically.

## Generate a spec

You can pass either a registered slug from `specs.config.json` or a Figma page
URL directly.

**Registered slug:**

```sh
npm --prefix scripts/figma-spec run spec sidenav
```

**One-off URL:**

```sh
npm --prefix scripts/figma-spec run spec -- \
  "https://www.figma.com/design/<fileKey>/<name>?node-id=<id>" \
  --slug sidenav
```

When using URL mode, `--slug` is optional — if omitted, the slug is derived
from the Figma page name. The output filename is always
`<outputDir>/<slug>.md` (default `<repo>/specs/<slug>.md`). Review and commit
it.

> **Note on `--`.** When invoking via `npm run`, the `--` separator forwards
> the URL and flags to the script untouched. Inside `scripts/figma-spec/` you
> can drop it: `npm run spec <url> --slug sidenav`.

## Figma file conventions

The walker keys off frame names. The conventions are:

| Frame name               | Treated as                                                   |
| ------------------------ | ------------------------------------------------------------ |
| `Specs Header` (a child) | Marks its parent frame as a top-level H2 section             |
| `fig::<slug>`            | Inline figure — exported as PNG, slug is the filename        |
| `table::<slug>`          | Table — PNG cached to `.cache/`, OCR'd into a Markdown table |
| (anything else)          | Plain frame, ignored by the walker                           |

`<slug>` must match `[A-Za-z0-9_-]+`. The frame's caption is the concatenated
text of its direct text children, in canvas top-to-bottom order.

### Embedding figures inline

Inside an H3 prose body, write `(fig. <slug>)` where you want the image to
appear. The marker is replaced with the rendered image + italic caption:

```
Dual tier panel will open when user interacts with an element that
has children (fig. dual-tier).
```

becomes:

```
Dual tier panel will open when user interacts with an element that
has children

![Caption text](sidenav/figures/dual-tier.png)

*Caption text*
```

If a `fig::<slug>` frame exists in a section but is never referenced inline,
the renderer tries to attach it to a heading whose slugified text matches
`<slug>`:

1. If `<slug>` matches the H2 section name → placed right under the H2.
2. Else, if `<slug>` matches an H3 title in the same section → placed right
   after that H3 block.
3. Else → appended at the end of the H2 section, in canvas y-order.

Heading slugs are computed with the same rule as page-name slugification
(lowercase, non-alphanumerics collapsed to `-`). For example, an H3 titled
`Header region` matches `fig::header-region`.

### Tables

`table::<slug>` frames are positioned by canvas `y` — they interleave with H3
prose blocks in reading order. Unlike figures, there is no inline marker; the
table appears wherever the frame sits visually in the section.

OCR pipeline, in order:

1. **Gemini 2.5 Flash.** Sent the cached PNG + a prompt asking for a clean
   Markdown table. 15-second timeout. Result is cleaned (code fences stripped,
   non-table chatter removed) and validated.
2. **Local `tesseract`.** Best-effort column inference from whitespace gaps. If
   most rows agree on a column count, emit a Markdown table.
3. **HTML-comment placeholder.** If both engines fail, the output contains a
   comment naming the slug and pointing at the cached PNG so a designer can
   transcribe it manually:
   ```
   <!--
     table::sidenav-color-tokens — OCR failed (engines tried: gemini, tesseract).
     Source PNG saved at: …/.cache/sidenav-color-tokens.png
     Transcribe manually and replace this comment.
   -->
   ```

The cache lives at `scripts/figma-spec/.cache/` and is gitignored.

## How the walker decides what is a "spec section"

The Figma page is expected to contain top-level frames where one of the direct
children is a text node named exactly `Specs Header`. Each such frame becomes
an H2 in the output.

Within an H2 section, the walker treats every direct text-node child whose left
edge sits at `x < 900` (canvas coordinates) as an H3 block. The first line of
the text becomes the H3 title; the remainder becomes the body.

Sections are emitted in canvas top-to-bottom order (`y` ascending).

## Repository layout produced

```
<repo>/
├── scripts/figma-spec/        # this tool
└── specs/
    └── sidenav.md             # generated, manually committed
```

Later phases will add `specs/<component>/figures/*.png` for embedded images and
inline tables produced via OCR.

## Troubleshooting

- **`FIGMA_TOKEN not set`** — add it to `<repo>/.env` or
  `scripts/figma-spec/.env`.
- **`Page node <id> not found`** — confirm the `pageId` in `specs.config.json`
  matches the page (canvas) node, not a frame inside it. Page nodes have
  type `CANVAS` in the Figma API.
- **No H2 sections in output** — the Figma file is missing frames whose
  children include a text node named `Specs Header`.
- **Missing H3 prose** — the H3 text node may be sitting at `x ≥ 900`, which
  the walker treats as a non-prose annotation. Move it left, or raise the
  threshold in `src/parser/h3.ts`.

## Roadmap

- **Phase 1.** Walker, H2, H3 prose.
- **Phase 2.** Inline figures via `fig::<slug>` frames; PNG export to
  `specs/<component>/figures/`.
- **Phase 3 — current.** Inline tables via `table::<slug>` frames + Gemini
  2.5 Flash OCR with `tesseract` fallback.
- **Phase 4.** `validate` subcommand for preflight checks.
- **Phase 5.** Caching by `lastModified`, concurrency, `--all` flag.
