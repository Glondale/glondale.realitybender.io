// app-loader.js
// Dynamic app loader: reads js/Apps/manifest.json and imports each module so it can register itself.

export async function loadApps() {
  if (typeof window === 'undefined') return [];
  try {
    // Always attempt to discover modules by recursively scraping the /js/Apps/ directory listing.
    // This intentionally ignores any on-disk manifest and imports discovered .js files every page load.
    const discovered = new Set();
    async function fetchDir(urlPath) {
      try {
        const res = await fetch(urlPath);
        if (!res.ok) return;
        const text = await res.text();
        const hrefs = Array.from(text.matchAll(/href="([^"]+)"/g)).map(m => m[1]);
        for (let h of hrefs) {
          if (!h || h === '../') continue;
          if (h.endsWith('/')) {
            // directory entry, recurse
            // ensure trailing slash present on urlPath
            const next = urlPath.replace(/\/?$/, '/') + h;
            await fetchDir(next);
          } else if (h.endsWith('.js')) {
            // Normalize to path relative to /js/Apps/
            // If href is absolute or starts with /js/Apps/, strip that prefix
            let rel = h.replace(/^\/?js\/Apps\//, '').replace(/^\//, '');
            // If href came from a subdirectory listing, prefix the directory portion
            const dirPrefix = urlPath.replace(/(^\/?js\/Apps\/|\/$)/g, '');
            if (dirPrefix && !h.startsWith('js/Apps/')) {
              rel = dirPrefix + (rel ? '/' + rel : '');
            }
            rel = rel.replace(/\/+/g, '/');
            if (rel) discovered.add(rel);
          }
        }
      } catch (e) {
        // ignore individual failures
      }
    }

    await fetchDir('/js/Apps/');
    const list = Array.from(discovered).sort();
    if (list.length === 0) {
      console.warn('No apps discovered under /js/Apps/');
      return [];
    }
    const loaded = [];
    await Promise.all(list.map(async (entry) => {
      try {
        const trimmed = entry.replace(/^\.\/?/, '');
        const fullPath = `/js/Apps/${trimmed}`;
        await import(fullPath);
        loaded.push(fullPath);
        console.log('App loaded:', fullPath);
      } catch (e) {
        console.error('Failed to load app module', entry, e);
      }
    }));
    window.__RBOS_APPS_LOADED__ = loaded;
    window.dispatchEvent(new CustomEvent('rbos:apps-loaded', { detail: loaded }));
    return loaded;
  } catch (e) {
    console.error('App loader error', e);
    return [];
  }
}

// Auto-run when imported
loadApps().catch(() => {});
