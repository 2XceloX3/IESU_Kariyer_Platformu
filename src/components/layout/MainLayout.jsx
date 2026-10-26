import React, { useMemo } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

export function useNavActive(basePath, activePatterns = []) {
  const location = useLocation();
  const isNavActive = useMemo(() => {
    const baseMatch = matchPath({ path: basePath }, location.pathname);
    if (baseMatch && (location.pathname === basePath || location.pathname === `${basePath}/`)) return true;

    return activePatterns.some(pattern => matchPath({ path: pattern }, location.pathname));
  }, [location.pathname, basePath, activePatterns]);

  return [isNavActive, () => {}];
}

export default function MainLayout({
  children,
  searchOpen,
  setSearchOpen,
  commandOpen,
  setCommandOpen,
  currentUser,
  handleLogout,
  handleLogin
}) {
  const location = useLocation();

  return (
    <div className="main-layout" data-testid="main-layout">
      {children}
    </div>
  );
}
