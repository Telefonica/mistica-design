export type FigmaNodeType =
  | "DOCUMENT"
  | "CANVAS"
  | "FRAME"
  | "GROUP"
  | "SECTION"
  | "TEXT"
  | "VECTOR"
  | "RECTANGLE"
  | "ELLIPSE"
  | "LINE"
  | "STAR"
  | "POLYGON"
  | "BOOLEAN_OPERATION"
  | "COMPONENT"
  | "COMPONENT_SET"
  | "INSTANCE"
  | "REGULAR_POLYGON"
  | "STAMP"
  | "STICKY"
  | "WIDGET"
  | "EMBED"
  | "LINK_UNFURL"
  | "MEDIA"
  | string;

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BaseNode {
  id: string;
  name: string;
  type: FigmaNodeType;
  visible?: boolean;
  children?: AnyNode[];
  absoluteBoundingBox?: BoundingBox | null;
}

export type LineType = "NONE" | "ORDERED" | "UNORDERED";

/** A URL-type hyperlink attached to a character run in a text node. */
export interface FigmaHyperlink {
  type: "URL";
  url: string;
}

/**
 * Per-character style override entry from `styleOverrideTable`.
 * Only the `hyperlink` field is modelled; other overrides (fills, font
 * weight, etc.) are ignored by this tool.
 */
export interface StyleOverride {
  hyperlink?: FigmaHyperlink;
}

export interface TextNode extends BaseNode {
  type: "TEXT";
  characters: string;
  lineTypes?: LineType[];
  lineIndentations?: number[];
  /**
   * One integer per character in `characters`, mapping to a key in
   * `styleOverrideTable`. A value of `0` means no override.
   */
  characterStyleOverrides?: number[];
  /** Map of override-key → style properties. */
  styleOverrideTable?: Record<number, StyleOverride>;
}

export type AnyNode = BaseNode | TextNode;

export interface FilesNodesResponse {
  name: string;
  lastModified: string;
  thumbnailUrl?: string;
  err?: string | null;
  nodes: Record<
    string,
    {
      document: AnyNode;
      lastModified?: string;
    } | null
  >;
}
