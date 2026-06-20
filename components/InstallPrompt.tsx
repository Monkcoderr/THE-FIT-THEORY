'use client';

import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'ftt-install-dismissed';
const DISMISS_DAYS = 7;

function recentlyDismissed(): boolean {
  try {
    const ts = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  return (
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
    !/crios|fxios/i.test(window.navigator.userAgent)
  );
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [iosHint, setIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isStandalone() || recentlyDismissed()) return;

    // Chromium / Android: capture the install event.
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onBIP);

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };
    window.addEventListener('appinstalled', onInstalled);

    // iOS has no beforeinstallprompt — show a manual hint instead.
    if (isIOS()) {
      setIosHint(true);
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="safe-bottom fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:right-4 sm:max-w-sm">
      <div className="flex items-start gap-3 rounded-2xl border border-nike-hairline-soft bg-white p-4 shadow-2xl shadow-black/20">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-nike-ink text-sm font-extrabold tracking-tight text-white">
          FT
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-nike-ink">
            Install The Fit Theory
          </p>
          {iosHint ? (
            <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-nike-mute">
              Tap <Share className="inline h-3.5 w-3.5" /> then{' '}
              <span className="font-medium text-nike-ink">
                Add to Home Screen
              </span>
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-nike-mute">
              Add the app to your home screen for a faster, full-screen
              experience.
            </p>
          )}

          {!iosHint && (
            <button
              onClick={install}
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-nike-ink px-4 text-xs font-semibold text-white transition-transform active:scale-95"
            >
              <Download className="h-4 w-4" />
              Install
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-nike-mute transition-colors hover:bg-nike-cloud hover:text-nike-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
