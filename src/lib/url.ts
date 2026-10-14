const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefix a root-relative path with the site base (e.g. `/about` → `/geowittejr-dot-com/about`). */
export function url(path = '/'): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path; // external or relative
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) return path; // already prefixed
  return BASE + path;
}

/** True when `href` (a `url()` result) is the current page or one of its children. */
export function isCurrent(href: string, pathname: string): boolean {
  const strip = (p: string) => p.replace(/\/+$/, '');
  return strip(pathname) === strip(href) || pathname.startsWith(`${strip(href)}/`);
}
