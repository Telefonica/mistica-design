# md-to-figma

Parses a `figma-spec`-generated markdown file (like `specs/sidenav.md`) into
structured JSON, for driving the `md-to-figma-specs` skill
(`.claude/skills/md-to-figma-specs/SKILL.md`). This is the reverse direction
of `scripts/figma-spec`: that tool walks a Figma page into markdown; this one
walks markdown back into a structure a Figma-writing script can consume.

## Usage

```sh
npm --prefix scripts/md-to-figma install
npm --prefix scripts/md-to-figma run parse -- /absolute/path/to/specs/sidenav.md --pretty
```

Pass an absolute path — `npm --prefix` runs the script with its own package
directory as `cwd`, so a relative path resolves against
`scripts/md-to-figma/`, not the repo root.

## Output shape

```ts
interface SpecDocument {
  title: string; // the H1, e.g. "Sidenav"
  sections: SpecSection[]; // H2 sections, in document order
}
interface SpecSection {
  heading: string; // e.g. "Anatomy"
  blocks: SpecBlock[];
}
interface SpecBlock {
  heading?: string; // H3/H4 text; absent for section-intro prose
  body: string[]; // paragraphs and list items, in order ("- " prefix kept on list items)
  figures: { caption: string; src: string }[];
  table?: string[][]; // rows[0] is the header row
}
```

## Behaviour notes

- The `Changelog` H2 section is dropped — it documents the generation
  pipeline, not the component's design.
- An italic caption line immediately following a figure (the `_caption_`
  echo that `figma-spec`'s renderer emits) is dropped; the figure's `caption`
  is already taken from the image's alt text, which is the same string.
- A block can carry both `figures` and a `table` (e.g. "Boxed container" in
  `sidenav.md`) — the consuming skill renders these as two rows, not one.
- List items are flattened to plain text with a leading `- `, one per `body`
  entry. Nested lists and inline formatting (bold/italic spans, links) are
  flattened to plain text; this is a known v1 limitation.
