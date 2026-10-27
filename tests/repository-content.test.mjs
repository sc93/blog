import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';

import { loadBlogPosts } from '../src/lib/content.ts';

test('repository posts and drafts use valid metadata after category changes', async () => {
  const dir = fileURLToPath(new URL('../src/content/blog/', import.meta.url));
  const allPosts = await loadBlogPosts(dir, true);
  const publicPosts = await loadBlogPosts(dir, false);
  assert.deepEqual(
    publicPosts.map((post) => post.slug),
    allPosts.filter((post) => post.metadata.published).map((post) => post.slug)
  );
});
