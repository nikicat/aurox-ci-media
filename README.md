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
- `compare.html?pr=<N>` / `diff.html?pr=<N>` — base-vs-PR side-by-side player
  (one scrub bar drives both) and normalized transcript diff, linked from
  each PR's `screencasts` check run.

The recordings are regenerable artifacts — `demos/build.sh` in aurox
reproduces them, so `pr-<N>/` dirs can be pruned freely. The Pages apps
(`*.html` + `player/`) are maintained here, though: this repo is their
source of truth. To hack on them locally, serve the repo root
(`python -m http.server`) — the pages fetch casts/transcripts, so `file://`
won't do.
