# Kangning Zhang Homepage

This repository contains the source for Kangning Zhang's academic homepage, built with the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme.

## Local preview

```bash
bundle install
bundle exec jekyll serve
```

The site is published at `https://zkangning.github.io/`.

## Publications

The homepage and `/publications/` share the same research-area layout.

- `_data/research_areas.yml` defines the five directions, their order, navigation labels, and introductions.
- `_data/publications.yml` stores each paper. Set `area` to `post-training`, `agent-harness`, `benchmarks`, `robotics`, or `recommendation`; `order` controls its position within that area. Each paper appears once. HCGRec follows the CV's post-training classification; Fints is grouped with recommendation and personalization.
- `_includes/publication_cards.liquid` renders the index and sections; `_includes/publication_card.liquid` renders individual papers.
- `_sass/_research-areas.scss` styles the shared layout, including mobile and dark themes.

Use public paper metadata for titles, author lists, and links. Video-Thinker is explicitly listed as under review with CV-based authorship, confirmed by Kangning on November 5, 2026; its linked arXiv version predates that author list. Publication previews live in `assets/img/publication_preview/`. The Harness-S, PhysCodeGym, ReuF2F, and Video-Thinker previews are figures from their papers (Figure 2, Figure 1, Figure 1, and Figure 2 respectively).
