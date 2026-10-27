import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { loadBlogPosts, parsePostMetadata } from '../src/lib/content.ts';

const metadata = {
  title: '학습 기록',
  description: '설명',
  date: '2026-10-27',
  category: 'development',
  tags: ['React', 'C++'],
  published: true,
};

test('validates required fields and real calendar dates', () => {
  assert.equal(parsePostMetadata(metadata, 'post').title, '학습 기록');
  for (const changes of [
    { date: '2026-02-30' },
    { date: '2026-1-1' },
    { published: 'false' },
    { category: 'bad' },
    { tags: 'React' },
    { title: '' },
    { description: '' },
  ]) {
    assert.throws(
      () => parsePostMetadata({ ...metadata, ...changes }, 'post.mdx'),
      /post.mdx/
    );
  }
  assert.equal(
    parsePostMetadata(
      { ...metadata, published: false, description: '' },
      'draft'
    ).description,
    ''
  );
});

test('excludes drafts from production and exposes them only in development', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'blog-content-'));
  try {
    for (const [slug, published] of [
      ['public', true],
      ['draft', false],
    ]) {
      await writeFile(
        path.join(dir, `${slug}.mdx`),
        `---\ntitle: ${slug}\ndescription: description\ndate: "2026-10-27"\ncategory: english\ntags: [React]\npublished: ${published}\n---\n# Content`
      );
    }
    assert.deepEqual(
      (await loadBlogPosts(dir, false)).map((post) => post.slug),
      ['public']
    );
    assert.equal((await loadBlogPosts(dir, true)).length, 2);
    await writeFile(path.join(dir, 'Bad Path.mdx'), '---\ntitle: invalid\n---');
    await assert.rejects(loadBlogPosts(dir, false), /slug/);
  } finally {
    await rm(dir, { recursive: true });
  }
});
