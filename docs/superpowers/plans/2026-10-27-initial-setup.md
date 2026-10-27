# Initial blog setup implementation plan

Goal: Finish the approved personal learning blog setup with small commits.
Architecture: Retain flat MDX content and existing render/UI components. A shared content loader validates metadata and excludes drafts outside development. Category and tag filters use /blog query parameters; articles remain static /blog/[slug].
Spec: User's initial requirements with subsequent URL and redirect decisions; AGENTS.md records the effective conventions.

## Constraints

No database/CMS, no redesign, no unrelated version upgrades, no external account changes. Node 24 and pnpm 10.14.0. Preserve original MIT attribution.

## Tasks and commit boundaries

- [x] Add AGENTS.md and this plan.
- [ ] Configure Husky/lint-staged, lint:fix and test scripts; preserve Prettier plugins.
- [ ] Test and implement metadata/date/slug validation, draft exclusion, category metadata, free tags, filter preservation and development previews. Explicitly migrate existing sample metadata.
- [ ] Test XML escaping and site URLs; align canonical/OG/robots/sitemap/RSS with shared URL and public content.
- [ ] Test and implement new:post (interactive plus optional flags), KST dates, safe exclusive file creation; write Korean README.
- [ ] Run install, tests, lint, format, types, build, production HTTP checks and independent code review; commit fixes separately.

## Review focus

Drafts must never be rendered or listed in production. Reject invalid dates, unsafe/reserved slugs and unknown categories with actionable file errors. Unknown tags/categories and invalid pages return 404. Filter changes reset page and pagination preserves both filters. XML handles &, <, quotes and CDATA terminators. CLI never overwrites a file or creates paths outside content. No private env files are staged.
