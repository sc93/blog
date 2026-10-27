import assert from 'node:assert/strict';
import test from 'node:test';

import { escapeXml, resolveSiteUrl } from '../src/lib/seo.ts';

test('normalizes a shared origin and rejects invalid site URLs', () => {
  assert.equal(resolveSiteUrl('https://example.com/'), 'https://example.com');
  assert.equal(
    resolveSiteUrl(undefined, 'blog.vercel.app'),
    'https://blog.vercel.app'
  );
  for (const url of [
    'ftp://example.com',
    'https://example.com/path',
    'https://user:pass@example.com',
    'bad',
  ])
    assert.throws(() => resolveSiteUrl(url));
});

test('escapes XML text including CDATA terminators', () => {
  assert.equal(
    escapeXml(`A & <B> "x" 'y' ]]>`),
    'A &amp; &lt;B&gt; &quot;x&quot; &apos;y&apos; ]]&gt;'
  );
});
