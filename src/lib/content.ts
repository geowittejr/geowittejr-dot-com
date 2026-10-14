import { getCollection, type CollectionEntry } from 'astro:content';

// Drafts show in `astro dev` and are excluded from production builds.
const visible = ({ data }: { data: { draft: boolean } }) => !import.meta.env.PROD || !data.draft;

/** Non-draft projects, newest year first, then by title. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects', visible);
  return projects.sort(
    (a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title),
  );
}

/** Non-draft posts, newest first. */
export async function getPosts(): Promise<CollectionEntry<'writing'>[]> {
  const posts = await getCollection('writing', visible);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
