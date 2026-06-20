'use client';

import { useEffect } from 'react';
import { toast as sonnerToast } from 'sonner';

/**
 * Registers the service worker and surfaces an "update available" toast when
 * a new version is deployed. Renders nothing.
 *
 * Update flow:
 *   1. A new SW is found and installs into the "waiting" state.
 *   2. We show a toast with a Refresh action.
 *   3. Clicking it posts SKIP_WAITING -> the SW activates -> controllerchange
 *      fires -> we reload once so the new assets take effect.
 */
export default function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (!window.isSecureContext) return;

    let refreshing = false;

    function promptUpdate(worker: ServiceWorker) {
      sonnerToast.message('Update available', {
        description: 'A new version of the app is ready.',
        duration: Infinity,
        action: {
          label: 'Refresh',
          onClick: () => worker.postMessage({ type: 'SKIP_WAITING' }),
        },
      });
    }

    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // A worker is already waiting (e.g. user returned to the tab).
          if (reg.waiting && navigator.serviceWorker.controller) {
            promptUpdate(reg.waiting);
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              // Installed + an existing controller => this is an update,
              // not the first install.
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                promptUpdate(newWorker);
              }
            });
          });
        })
        .catch(() => {
          // Non-fatal — the app still works online without the SW.
        });
    };

    // Reload once the new SW takes control.
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      onControllerChange
    );
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange
      );
    };
  }, []);

  return null;
}
