// Populate a demo <select> from whatever recordings actually exist in a media
// directory, instead of a hard-coded list that silently drifts every time a
// demo is added (as `ctrlc-refresh` did — recorded into pr-56/ but missing
// from the compare/diff dropdowns). The set is also per-directory: a PR can
// carry a demo `main/` does not yet have, so the list must reflect the dir
// being viewed, not one global constant.
//
// Resolution order, most authoritative first:
//   1. <dir>/manifest.json — published by aurox's Screencasts workflow from
//      the single demos/demos.json registry; an array of [name, title].
//   2. the GitHub contents API listing of <dir> — covers dirs recorded before
//      manifests existed (no CI re-run needed); yields names only.
//   3. whatever <option>s the page already ships — offline last resort; on
//      total failure the page's own markup is left untouched.

// "nikicat.github.io/aurox-ci-media/compare.html" -> ["nikicat", "aurox-ci-media"]
// so a fork's pages hit the fork's API, not this repo's.
function auroxRepoSlug() {
  const owner = location.hostname.split('.')[0];
  const repo = location.pathname.replace(/^\/+/, '').split('/')[0];
  return [owner, repo];
}

// ?pr=56 -> "pr-56"; absent -> "main".
function auroxDir(pr) { return pr ? 'pr-' + pr : 'main'; }

// Returns [{name, title}] for the recordings in `dir`, or null if nothing
// could be discovered (the caller then keeps its static fallback markup).
async function auroxListDemos(dir) {
  // 1. CI-published manifest — the single source of truth, and it carries the
  //    human-readable titles the check-run gallery uses too.
  try {
    const r = await fetch(dir + '/manifest.json', { cache: 'no-cache' });
    if (r.ok) {
      const list = (await r.json()).map(e => Array.isArray(e)
        ? { name: e[0], title: e[1] || '' }
        : { name: e.name, title: e.title || '' });
      if (list.length) return list;
    }
  } catch (_) { /* fall through to directory listing */ }

  // 2. Directory listing, for dirs published before manifests existed.
  try {
    const [owner, repo] = auroxRepoSlug();
    const r = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${dir}`,
      { headers: { Accept: 'application/vnd.github+json' } });
    if (r.ok) {
      const list = (await r.json())
        .filter(f => f.type === 'file' && f.name.endsWith('.cast'))
        .map(f => ({ name: f.name.slice(0, -'.cast'.length), title: '' }))
        .sort((a, b) => a.name.localeCompare(b.name));
      if (list.length) return list;
    }
  } catch (_) { /* fall through to the page's static fallback */ }

  return null;
}

// Fill `sel` with the demos in `dir`, keeping `current` selected if it still
// exists (else the first demo). On total discovery failure the page's existing
// <option>s are left in place. Returns the effective selection.
async function auroxPopulateSelect(sel, dir, current) {
  const demos = await auroxListDemos(dir);
  if (demos) {
    sel.innerHTML = demos.map(d => {
      const t = d.title ? ` title="${d.title.replace(/"/g, '&quot;')}"` : '';
      return `<option value="${d.name}"${t}>${d.name}</option>`;
    }).join('');
  }
  const names = [...sel.options].map(o => o.value);
  const chosen = names.includes(current) ? current : (names[0] || current);
  sel.value = chosen;
  return chosen;
}
