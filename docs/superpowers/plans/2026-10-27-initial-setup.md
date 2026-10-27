# Initial blog setup implementation plan

Goal: Finish the approved personal learning blog setup with small commits.
Architecture: Retain flat MDX content and existing render/UI components. A shared content loader validates metadata and excludes drafts outside development. Category and tag filters use /blog query parameters; articles remain static /blog/[slug].
Spec: User's initial requirements with subsequent URL and redirect decisions; AGENTS.md records the effective conventions.

## Constraints

No database/CMS, no redesign, no unrelated version upgrades, no external account changes. Node 24 and pnpm 10.14.0. Preserve original MIT attribution.

## Tasks and commit boundaries

- [x] Add AGENTS.md and this plan.
- [x] Configure Husky/lint-staged, lint:fix and test scripts; preserve Prettier plugins.
- [x] Test and implement metadata/date/slug validation, draft exclusion, category metadata, free tags, filter preservation and development previews. Explicitly migrate existing sample metadata.
- [x] Test XML escaping and site URLs; align canonical/OG/robots/sitemap/RSS with shared URL and public content.
- [x] Test and implement new:post (interactive plus optional flags), KST dates, safe exclusive file creation; write Korean README.
- [x] Run install, tests, lint, format, types, build, production HTTP checks and independent code review; commit fixes separately.

## Review focus

Drafts must never be rendered or listed in production. Reject invalid dates, unsafe/reserved slugs and unknown categories with actionable file errors. Unknown tags/categories and invalid pages return 404. Filter changes reset page and pagination preserves both filters. XML handles &, <, quotes and CDATA terminators. CLI never overwrites a file or creates paths outside content. No private env files are staged.

## Verification results

- `pnpm install --frozen-lockfile`, `pnpm test` (11 tests), `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm build`: passed.
- Production HTTP: home, list, pagination, combined category/tag, empty category and article pages passed; unknown category/tag/article, old routes and draft article returned 404.
- Parsed RSS (12 public items) and Sitemap (14 public URLs) as XML; neither contained draft-example.
- Development server displayed draft-example with the draft notice. Production build generated only 12 public article pages.
- Verified the dynamic /blog function trace includes the MDX files for Vercel.
- Interactive new:post and flag-based creation passed; duplicate/path traversal rejection passed in tests.
- Real Husky hook rejected invalid staged TypeScript in a disposable repository; successful project commits also ran lint-staged.
- Independent read-only AI review found no actionable new defects. Existing template visuals and MDX components remain reused.
- Added only Husky and lint-staged. Allowed the existing sharp and Tailwind oxide installation scripts explicitly in pnpm-workspace.yaml; rebuilds passed.

Decisions: retain metadata categories but use query filters, keep flat content and global slugs, use Node 24's built-in TypeScript support for tests/CLI, disable embedded code formatting only in MDX to preserve template teaching snippets that contain intentionally incomplete code. GitHub/Vercel account settings and main are unchanged.
