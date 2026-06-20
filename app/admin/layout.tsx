'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  // Login page renders standalone (no sidebar/header shell)
  if (isLogin) {
    return <div className="min-h-screen bg-admin-bg text-admin-text">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-admin-bg text-admin-text">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="mx-auto w-full max-w-vercel p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
