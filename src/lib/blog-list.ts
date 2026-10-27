export type BlogListQuery = {
  page?: string | string[];
  tag?: string | string[];
};

export function getBlogListHref(page = 1, tag?: string): string {
  const query = new URLSearchParams();
  if (page !== 1) query.set('page', String(page));
  if (tag) query.set('tag', tag);
  return query.size ? `/blog?${query}` : '/blog';
}

export function selectBlogPage<T extends { metadata: { tags?: string[] } }>(
  posts: T[],
  query: BlogListQuery
) {
  if (Array.isArray(query.page) || Array.isArray(query.tag)) return undefined;
  const pageValue = query.page ?? '1';
  if (!/^[1-9]\d*$/.test(pageValue)) return undefined;
  const currentPage = Number(pageValue);
  const filtered = query.tag
    ? posts.filter((post) => post.metadata.tags?.includes(query.tag as string))
    : posts;
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / 6));
  if (!Number.isSafeInteger(currentPage) || currentPage > totalPages) {
    return undefined;
  }
  return {
    items: filtered.slice((currentPage - 1) * 6, currentPage * 6),
    currentPage,
    totalPages,
    totalItems,
  };
}
