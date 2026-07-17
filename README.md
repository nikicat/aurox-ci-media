# aurox-ci-media

CI screencast artifacts for [aurox](https://github.com/nikicat/aurox) — the
sidecar half of its screencast pipeline (see `docs/plans/screencasts.md`
there).

- `main/` — the current demo recordings (`.cast` + `.gif`), refreshed by
  aurox's Screencasts workflow on every merge to main. This is the base for
  PR comparisons.
- `pr-<N>/` — per-PR recordings pushed by the same workflow; referenced from
  each PR's `screencasts` check run. Prunable at will.
- `play.html` + `player/` — self-hosted
  [asciinema-player](https://github.com/asciinema/asciinema-player) (v3.17.0):
  <https://nikicat.github.io/aurox-ci-media/play.html?cast=main/search-install.cast>

Junk repo by design: history rewrites, force-pushes, and wholesale pruning
are all fair game — nothing here is a source of truth (casts and GIFs are
reproducible from aurox itself via `demos/build.sh`).
