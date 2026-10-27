import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createPost, koreaDate } from '../scripts/new-post.mjs';
import { loadBlogPosts } from '../src/lib/content.ts';

test('creates a valid draft safely and never overwrites content', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'blog-cli-'));
  try {
    const input = {
      category: 'english',
      title: 'English: "hello"\nworld',
      slug: 'daily-english',
    };
    const file = await createPost(input, dir);
    const original = await readFile(file, 'utf8');
    const posts = await loadBlogPosts(dir, true);
    assert.equal(posts[0].metadata.title, input.title);
    assert.equal(posts[0].metadata.published, false);
    assert.equal(posts[0].metadata.category, 'english');
    assert.deepEqual(await loadBlogPosts(dir, false), []);
    await assert.rejects(createPost(input, dir), /exist/i);
    assert.equal(await readFile(file, 'utf8'), original);
    for (const changes of [
      { slug: '../escape' },
      { slug: 'Uppercase' },
      { category: 'unknown' },
      { title: ' ' },
    ]) {
      await assert.rejects(createPost({ ...input, ...changes }, dir));
    }
  } finally {
    await rm(dir, { recursive: true });
  }
});

test('uses the Korean calendar date across the UTC boundary', () => {
  assert.equal(koreaDate(new Date('2026-10-26T16:00:00Z')), '2026-10-27');
});
