import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// Server-only write client. Used by the subscribe / unsubscribe paths and the
// send script to stamp an issue as sent. Requires an Editor-role token.
const token = process.env.SANITY_API_WRITE_TOKEN;

export const hasWriteToken = Boolean(token);

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});
