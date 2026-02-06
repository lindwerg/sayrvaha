import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

const isSanityConfigured = !!projectId;

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
});

export async function sanityFetch<T>(
  query: string,
  params?: QueryParams,
  tags?: string[],
): Promise<T | null> {
  if (!isSanityConfigured) return null;
  return client.fetch<T>(query, params ?? {}, {
    next: { tags: tags ?? [] },
  });
}
