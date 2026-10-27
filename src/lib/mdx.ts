import path from 'node:path';

import {
  loadBlogPosts,
  type ContentPost,
  type PostMetadata,
} from '@/lib/content';

export const DEFAULT_BLOG_LIST_LIMIT = 6;
export type Frontmatter = PostMetadata;
export type BlogPost = ContentPost;

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return loadBlogPosts(
    path.join(process.cwd(), 'src', 'content', 'blog'),
    process.env.NODE_ENV === 'development'
  );
}

export async function getBlogPostBySlug(slug: string) {
  return (await getAllBlogPosts()).find((post) => post.slug === slug);
}
