export type BlogListQuery = {
  page?: string | string[];
  tag?: string | string[];
  category?: string | string[];
};

export function getBlogListHref(
  page = 1,
  tag?: string,
  category?: string
): string {
  const query = new URLSearchParams();
  if (page !== 1) query.set('page', String(page));
  if (tag) query.set('tag', tag);
  if (category) query.set('category', category);
  return query.size ? `/blog?${query}` : '/blog';
}

export function selectBlogPage<
  T extends { metadata: { tags?: string[]; category?: string } },
>(posts: T[], query: BlogListQuery) {
  if (
    Array.isArray(query.page) ||
    Array.isArray(query.tag) ||
    Array.isArray(query.category)
  )
    return undefined;
  const pageValue = query.page ?? '1';
  if (!/^[1-9]\d*$/.test(pageValue)) return undefined;
  const currentPage = Number(pageValue);
  const { tag, category } = query;
  const filtered = posts.filter(
    (post) =>
      (!tag || post.metadata.tags?.includes(tag)) &&
      (!category || post.metadata.category === category)
  );
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
