export const SITE_TITLE = 'George Witte Jr.';
export const SITE_DESCRIPTION =
  'Senior software engineer. Projects, case studies, and writing on building software.';

export const LINKS = {
  github: 'https://github.com/geowittejr',
  linkedin: 'https://www.linkedin.com/in/geowittejr',
  resume: '/resume',
  contact: '/contact',
};

/** Default social share image (public/og-image.png), 1200×630. */
export const OG_IMAGE = '/og-image.png';

// Cloudflare Turnstile site key for the contact form CAPTCHA. This is Cloudflare's public
// test key (always passes); swap in the real key when the form is wired to a backend.
export const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

export const NAV = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/contact', label: 'Contact' },
];
