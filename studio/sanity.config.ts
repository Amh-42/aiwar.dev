import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./schemaTypes";

// Standalone Studio — same shape as forbes.et / fact.et. projectId and dataset
// come from SANITY_STUDIO_* env vars so a staging Studio can point elsewhere
// without a code change.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET!;

export default defineConfig({
  name: "default",
  title: "aiwar.dev — AI, Actually Useful",
  projectId,
  dataset,
  schema,
  plugins: [structureTool(), visionTool()],
});
