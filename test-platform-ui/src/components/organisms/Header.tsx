/* eslint-disable @next/next/no-img-element */
'use client';

import Box from '@mui/material/Box';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import PlatformBreadCrumbs, { IBreadCrumbs } from '../atoms/BreadCrumbs';
import { COOKIE } from '@/constants/common';
import Cookies from 'js-cookie';

interface IHeader {
  children?: React.ReactNode;
}

const Header: React.FC<IHeader> = ({ children }) => {
  const pathname = usePathname();
  const [breadCrumbs, setBreadCrumbs] = React.useState<IBreadCrumbs[]>();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const navigator = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const mapBreadCrumbs = (paths: string) => {
    const splitPath = paths
      .split('/')
      .map((path: string, indx: number, paths: string[]) => {
        return {
          name: path.charAt(0).toUpperCase() + path.slice(1),
          href: '/' + paths.slice(0, indx + 1).join('/'),
        };
      })
      .filter(Boolean);
    setBreadCrumbs(splitPath);
  };

  React.useEffect(() => {
    const pathWithoutFirstSlash = pathname.replace(/^\/|\/$/g, '');
    mapBreadCrumbs(pathWithoutFirstSlash);
  }, [pathname]);

  const handleLogout = async () => {
    await Cookies.remove(COOKIE.TOKEN);
    navigator.push('/');
  };

  return (
    <Box className="flex h-auto items-center justify-between gap-5 bg-white p-6">
      {breadCrumbs && !children ? (
        <PlatformBreadCrumbs breadcrumbs={breadCrumbs} />
      ) : (
        children
      )}
      <div ref={menuRef}>
        <button
          type="button"
          onClick={toggleMenu}
          className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          id="user-menu-button"
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          aria-haspopup="true"
        >
          <span className="absolute -inset-1.5"></span>
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </button>
        {/* Dropdown menu code */}
        {isMenuOpen && (
          <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700">
              Your Profile
            </a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700">
              Settings
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700"
              onClick={handleLogout}
            >
              Sign out
            </a>
          </div>
        )}
      </div>
    </Box>
  );
};

export default Header;
