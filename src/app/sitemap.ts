import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/config';
import { getPostDateTime } from '@/lib/content';
import { getAllBlogPosts } from '@/lib/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const posts = (await getAllBlogPosts()).filter(
    (post) => post.metadata.published
  );
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(getPostDateTime(post.metadata)),
  }));

  const staticPages = [
    {
      url: baseUrl,
    },
    {
      url: `${baseUrl}/blog`,
    },
  ];

  return [...staticPages, ...blogPages];
}
