import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// Write-capable client. Kept free of the `server-only` guard so the CLI scripts
// (seed, newsletter:send) can import it too — writeClient.ts re-exports this
// behind that guard for anything running inside the app.
const token = process.env.SANITY_API_WRITE_TOKEN;

export const hasWriteToken = Boolean(token);

export const mutateClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});
