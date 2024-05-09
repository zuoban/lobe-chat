'use client';

import { usePathname } from 'next/navigation';
import { memo } from 'react';

import { useQuery } from '@/hooks/useQuery';

import { LayoutProps } from './type';

const MOBILE_IGNORE_NAV_ROUTES = ['/settings/', '/chat/'];

const Layout = memo(({ children, nav }: LayoutProps) => {
  const { showMobileWorkspace } = useQuery();
  const pathname = usePathname();
  const hideNav =
    showMobileWorkspace || MOBILE_IGNORE_NAV_ROUTES.some((path) => pathname.startsWith(path));

  return (
    <>
      {children}
      {!hideNav && nav}
    </>
  );
});

Layout.displayName = 'MobileMainLayout';

export default Layout;
