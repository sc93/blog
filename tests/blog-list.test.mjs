import assert from 'node:assert/strict';
import test from 'node:test';

import { getBlogListHref, selectBlogPage } from '../src/lib/blog-list.ts';

const posts = Array.from({ length: 15 }, (_, index) => ({
  slug: String(index),
  metadata: { tags: index % 2 === 0 ? ['mdx'] : ['nextjs'] },
}));

test('filters before paginating and retains the filtered total', () => {
  const result = selectBlogPage(posts, { page: '2', tag: 'mdx' });
  assert.equal(result?.totalItems, 8);
  assert.equal(result?.totalPages, 2);
  assert.deepEqual(
    result?.items.map((post) => post.slug),
    ['12', '14']
  );
});

test('defaults to first page and supports empty lists', () => {
  assert.equal(selectBlogPage(posts, {})?.items.length, 6);
  assert.deepEqual(selectBlogPage([], {})?.items, []);
  assert.equal(selectBlogPage([], { page: '2' }), undefined);
});

test('rejects malformed, repeated and out-of-range page parameters', () => {
  for (const page of ['0', '-1', '1x', '1.5', '', '999', ['1', '2']]) {
    assert.equal(selectBlogPage(posts, { page }), undefined);
  }
  assert.equal(selectBlogPage(posts, { tag: ['mdx', 'nextjs'] }), undefined);
});

test('builds query links, resets to first page and encodes tags', () => {
  assert.equal(getBlogListHref(), '/blog');
  assert.equal(getBlogListHref(2, 'mdx'), '/blog?page=2&tag=mdx');
  assert.equal(getBlogListHref(1, 'C++'), '/blog?tag=C%2B%2B');
});
