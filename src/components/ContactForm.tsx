import { useEffect, useRef, useState, type FocusEvent, type SyntheticEvent } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Load the Turnstile script once, shared across mounts. */
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  if (!script) {
    script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    document.head.append(script);
  }
  return new Promise((resolve, reject) => {
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Turnstile failed to load')), { once: true });
  });
}

type Field = HTMLInputElement | HTMLTextAreaElement;

// Keep aria-invalid in sync with the visual :user-invalid state.
const syncAria = (el: Field) => {
  if (el.matches(':user-invalid')) el.setAttribute('aria-invalid', 'true');
  else el.removeAttribute('aria-invalid');
};

const input =
  'block w-full rounded-md border border-border bg-bg px-3 py-2 text-fg user-invalid:border-red-600 dark:user-invalid:border-red-400';
const error =
  'mt-1 hidden text-sm text-red-700 peer-user-invalid:block dark:text-red-400';

/** Contact form with a Cloudflare Turnstile CAPTCHA. Not wired to a backend yet: submit only validates. */
export default function ContactForm({ siteKey }: { siteKey: string }) {
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !captchaRef.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(captchaRef.current, {
          sitekey: siteKey,
          theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
          callback: (t: string) => {
            setToken(t);
            setCaptchaError(null);
          },
          'expired-callback': () => setToken(null),
          'error-callback': () => setCaptchaError('CAPTCHA failed to load. Please refresh and try again.'),
        });
      })
      .catch(() => setCaptchaError('CAPTCHA failed to load. Please refresh and try again.'));
    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
    };
  }, [siteKey]);

  function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    form.querySelectorAll<Field>('input, textarea').forEach(syncAria);
    if (!token) {
      setCaptchaError('Please complete the CAPTCHA.');
      return;
    }
    // TODO: POST name, email, message, and the Turnstile token to a backend that verifies the token.
    const name = new FormData(form).get('name');
    setSentTo(typeof name === 'string' ? name : '');
    form.reset();
    setToken(null);
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }

  const onBlur = (e: FocusEvent<HTMLFormElement>) => {
    const el = e.target as Element;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) syncAria(el);
  };
  const onInput = (e: SyntheticEvent<HTMLFormElement>) => {
    const el = e.target as Element;
    if ((el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && el.hasAttribute('aria-invalid')) {
      syncAria(el);
    }
  };

  if (sentTo !== null) {
    return (
      <div role="status" className="rounded-md border border-border bg-bg-subtle p-4">
        <p className="m-0 font-medium">Thanks{sentTo ? `, ${sentTo}` : ''}! Your message is on its way.</p>
        <button
          type="button"
          className="mt-3 cursor-pointer border-0 bg-transparent p-0 text-accent underline"
          onClick={() => setSentTo(null)}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={onSubmit} onBlur={onBlur} onInput={onInput}>
      <div>
        <label htmlFor="contact-name" className="mb-1 block font-medium">
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          aria-errormessage="contact-name-error"
          className={`peer ${input}`}
        />
        <p id="contact-name-error" className={error}>
          <span aria-hidden="true">⚠ </span>Please enter your name.
        </p>
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block font-medium">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          aria-errormessage="contact-email-error"
          className={`peer ${input}`}
        />
        <p id="contact-email-error" className={error}>
          <span aria-hidden="true">⚠ </span>Please enter a valid email address.
        </p>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block font-medium">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          aria-errormessage="contact-message-error"
          className={`peer ${input} resize-y`}
        />
        <p id="contact-message-error" className={error}>
          <span aria-hidden="true">⚠ </span>Please enter a message.
        </p>
      </div>
      <div>
        <div ref={captchaRef} className="min-h-[65px]" />
        {captchaError && (
          <p role="alert" className="mt-1 mb-0 text-sm text-red-700 dark:text-red-400">
            {captchaError}
          </p>
        )}
      </div>
      <div>
        <button
          type="submit"
          className="cursor-pointer rounded-md border-0 bg-accent px-5 py-2 font-medium text-bg hover:opacity-90"
        >
          Send message
        </button>
      </div>
    </form>
  );
}
