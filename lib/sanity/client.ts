import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, readToken } from "./env";

// Published content, served from Sanity's CDN. Same setup as forbes.et / fact.et.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  token: readToken,
});

// Direct-API variant for reads that must be guaranteed fresh (the send script,
// the archive after a publish).
export const freshClient = client.withConfig({ useCdn: false });
