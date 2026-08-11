import { z } from "zod";

export const FigureSchema = z.object({
  caption: z.string(),
  src: z.string(),
});
export type Figure = z.infer<typeof FigureSchema>;

export const SpecBlockSchema = z.object({
  heading: z.string().optional(),
  body: z.array(z.string()),
  figures: z.array(FigureSchema),
  table: z.array(z.array(z.string())).optional(),
});
export type SpecBlock = z.infer<typeof SpecBlockSchema>;

export const SpecSectionSchema = z.object({
  heading: z.string(),
  blocks: z.array(SpecBlockSchema),
});
export type SpecSection = z.infer<typeof SpecSectionSchema>;

export const SpecDocumentSchema = z.object({
  title: z.string(),
  sections: z.array(SpecSectionSchema),
});
export type SpecDocument = z.infer<typeof SpecDocumentSchema>;
