import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

import { categories, isValidSlug } from '../src/lib/content.ts';

export function koreaDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function koreaTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

export async function createPost(
  { category, title, slug },
  dir = path.join(process.cwd(), 'src/content/blog')
) {
  if (!Object.hasOwn(categories, category))
    throw new Error('유효한 category를 선택하세요.');
  if (typeof title !== 'string' || !title.trim())
    throw new Error('title을 입력하세요.');
  if (typeof slug !== 'string' || !isValidSlug(slug))
    throw new Error('slug는 소문자 영문·숫자·하이픈만 사용할 수 있습니다.');
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${slug}.mdx`);
  const now = new Date();
  const content = `---
title: ${JSON.stringify(title.trim())}
description: ""
date: "${koreaDate(now)}"
time: "${koreaTime(now)}"
category: ${category}
tags: []
published: false
---

## 학습 내용

`;
  await writeFile(file, content.trimEnd() + '\n', { flag: 'wx' });
  return file;
}

async function main() {
  const { values } = parseArgs({
    options: {
      category: { type: 'string' },
      title: { type: 'string' },
      slug: { type: 'string' },
    },
  });
  const input = { ...values };
  if (!input.category || !input.title || !input.slug) {
    const reader = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    try {
      input.category ||= await reader.question(
        `Category (${Object.keys(categories).join('/')}): `
      );
      input.title ||= await reader.question('Title: ');
      input.slug ||= await reader.question('Slug: ');
    } finally {
      reader.close();
    }
  }
  const file = await createPost(input);
  process.stdout.write(
    `초안을 생성했습니다: ${path.relative(process.cwd(), file)}\n`
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    process.stderr.write(
      `${error.code === 'EEXIST' ? '이미 존재하는 파일입니다. 덮어쓰지 않습니다.' : error.message}\n`
    );
    process.exitCode = 1;
  });
}
