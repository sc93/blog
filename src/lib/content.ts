import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export const categories = {
  development: {
    name: '개발',
    description: '개발 기술과 문제 해결 기록',
  },
  english: { name: '영어', description: '영어 단어, 표현과 문법' },
} as const;

export type Category = keyof typeof categories;
export type PostMetadata = {
  title: string;
  description: string;
  date: string;
  category: Category;
  tags: string[];
  published: boolean;
  thumbnail?: string;
};
export type ContentPost = {
  metadata: PostMetadata;
  slug: string;
  rawContent: string;
};

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function parsePostMetadata(
  data: Record<string, unknown>,
  file: string
): PostMetadata {
  function fail(field: string): never {
    throw new Error(`${file}: invalid ${field}`);
  }
  if (typeof data.title !== 'string' || !data.title.trim()) fail('title');
  if (typeof data.published !== 'boolean') fail('published');
  if (
    typeof data.description !== 'string' ||
    (data.published && !data.description.trim())
  )
    fail('description');
  if (typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date))
    fail('date (YYYY-MM-DD)');
  const date = new Date(`${data.date}T00:00:00.000Z`);
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== data.date
  )
    fail('date');
  if (
    typeof data.category !== 'string' ||
    !Object.hasOwn(categories, data.category)
  )
    fail('category');
  if (
    !Array.isArray(data.tags) ||
    !data.tags.every(
      (tag) => typeof tag === 'string' && tag.trim() === tag && tag.length > 0
    ) ||
    new Set(data.tags).size !== data.tags.length
  )
    fail('tags');
  if (
    data.thumbnail !== undefined &&
    (typeof data.thumbnail !== 'string' || !data.thumbnail.trim())
  )
    fail('thumbnail');
  return {
    title: data.title,
    description: data.description,
    date: data.date,
    category: data.category as Category,
    tags: data.tags as string[],
    published: data.published,
    ...(data.thumbnail ? { thumbnail: data.thumbnail as string } : {}),
  };
}

export async function loadBlogPosts(
  dir: string,
  includeDrafts = false
): Promise<ContentPost[]> {
  const files = (await readdir(dir)).filter(
    (file) => path.extname(file) === '.mdx'
  );
  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = path.basename(file, '.mdx');
      if (!isValidSlug(slug)) throw new Error(`${file}: invalid slug`);
      const { data, content } = matter(
        await readFile(path.join(dir, file), 'utf8')
      );
      return {
        slug,
        metadata: parsePostMetadata(data, file),
        rawContent: content,
      };
    })
  );
  return posts
    .filter((post) => includeDrafts || post.metadata.published)
    .sort(
      (a, b) =>
        b.metadata.date.localeCompare(a.metadata.date) ||
        a.slug.localeCompare(b.slug)
    );
}
