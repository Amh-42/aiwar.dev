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

// next-sanity derives a query's params from its *literal* type. That works for
// the groq`` queries in lib/queries.ts, but not for small hand-written lookups
// built at runtime, where it collapses the params type to `never`. This wrapper
// keeps those call sites readable instead of fighting the inference at each one.
export async function fetchQuery<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  // .bind is load-bearing: the client's fetch reads private fields off `this`,
  // so calling a detached reference throws "Cannot read properties of
  // undefined". Every caller here swallows errors, which made that failure look
  // like an empty list rather than a crash.
  const run = freshClient.fetch.bind(freshClient) as unknown as (
    q: string,
    p: Record<string, unknown>
  ) => Promise<T>;
  return run(query, params);
}
