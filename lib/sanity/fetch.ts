import "server-only";
import { client } from "./client";

// Single fetch entry point for server components. Pages cache at the edge and
// revalidate on a timer, so traffic spikes cost nothing.
const DEFAULT_REVALIDATE = 60;

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  revalidate = DEFAULT_REVALIDATE,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags: string[];
  revalidate?: number | false;
}): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate, tags } });
}
