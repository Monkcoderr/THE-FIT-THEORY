'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/admin';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Login failed');
        setLoading(false);
        return;
      }

      toast.success('Welcome back');
      router.push(from);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Mesh gradient backdrop */}
      <div className="mesh-gradient pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-admin-text">
            FIT<span className="text-admin-blue">.</span>THEORY
          </h1>
          <p className="mt-2 text-sm text-admin-text-soft">
            Admin dashboard — sign in to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-admin-border bg-admin-surface/80 p-6 shadow-2xl backdrop-blur-xl"
        >
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-admin-text"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-mute" />
            <input
              id="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="h-11 w-full rounded-md border border-admin-border bg-admin-surface-2 pl-10 pr-3 text-sm text-admin-text placeholder:text-admin-mute focus:border-admin-blue focus:outline-none focus:ring-1 focus:ring-admin-blue"
            />
          </div>

          {error && (
            <p className="mt-2 text-xs text-admin-red">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-admin-blue text-sm font-medium text-white transition-colors hover:bg-admin-blue-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-admin-mute">
          Protected area · single-operator access
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-admin-blue" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
