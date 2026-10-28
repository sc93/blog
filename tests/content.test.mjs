import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  getPostDateTime,
  loadBlogPosts,
  parsePostMetadata,
} from '../src/lib/content.ts';

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

test('validates optional Korean writing times', () => {
  assert.equal(
    parsePostMetadata({ ...metadata, time: '23:59:59' }, 'post').time,
    '23:59:59'
  );
  for (const time of ['24:00:00', '12:60:00', '12:00:60', '9:00:00', '', 123]) {
    assert.throws(
      () => parsePostMetadata({ ...metadata, time }, 'post.mdx'),
      /post.mdx/
    );
  }
  assert.equal(parsePostMetadata(metadata, 'post').time, undefined);
});

test('sorts by date then writing time while keeping drafts private and ties deterministic', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'blog-order-'));
  try {
    const fixtures = [
      ['a-morning', '2026-10-28', '09:00:00', true],
      ['z-evening', '2026-10-28', '18:00:00', true],
      ['older', '2026-10-27', '23:59:59', true],
      ['a-no-time', '2026-10-28', undefined, true],
      ['b-midnight', '2026-10-28', '00:00:00', true],
      ['future', '2026-10-29', undefined, true],
      ['draft', '2026-10-28', '23:00:00', false],
    ];
    for (const [slug, date, time, published] of fixtures) {
      await writeFile(
        path.join(dir, `${slug}.mdx`),
        `---\ntitle: ${slug}\ndescription: description\ndate: "${date}"\n${time === undefined ? '' : `time: "${time}"\n`}category: development\ntags: []\npublished: ${published}\n---\nContent`
      );
    }
    assert.deepEqual(
      (await loadBlogPosts(dir)).map((p) => p.slug),
      ['future', 'z-evening', 'a-morning', 'a-no-time', 'b-midnight', 'older']
    );
    assert.deepEqual(
      (await loadBlogPosts(dir, true)).map((p) => p.slug),
      [
        'future',
        'draft',
        'z-evening',
        'a-morning',
        'a-no-time',
        'b-midnight',
        'older',
      ]
    );
  } finally {
    await rm(dir, { recursive: true });
  }
});

test('uses Korean timestamps consistently for feed and metadata dates', () => {
  assert.equal(
    getPostDateTime({ date: '2026-10-28', time: '13:28:38' }),
    '2026-10-28T13:28:38+09:00'
  );
  assert.equal(
    new Date(getPostDateTime({ date: '2026-10-28' })).toISOString(),
    '2026-10-27T15:00:00.000Z'
  );
});
