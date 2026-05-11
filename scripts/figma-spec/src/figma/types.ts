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

export interface TextNode extends BaseNode {
  type: "TEXT";
  characters: string;
  lineTypes?: LineType[];
  lineIndentations?: number[];
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
