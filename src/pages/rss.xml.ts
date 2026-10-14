import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPosts } from '../lib/content';
import { url } from '../lib/url';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${SITE_TITLE}: Writing`,
    description: SITE_DESCRIPTION,
    site: new URL(url('/'), context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: url(`/writing/${post.id}/`),
    })),
  });
}
