/* eslint-disable react/display-name */
'use client';

import { ROUTE_KEY } from '@/constants/routePaths';
import { AuthContext, DataContext } from '@/libs/contextStore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import QuizIcon from '@mui/icons-material/Quiz';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { Fragment, useContext, useState } from 'react';

interface ILink {
  name: string;
  href: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
}

interface IMainLink extends ILink {
  sublinks?: ILink[];
  byRole?: string;
}

/**
 *  Map of links to display in the side navigation.
 *  Depending on the size of the application, this would be stored in a database.
 */

const links: IMainLink[] = [
  {
    name: 'Dashboard',
    href: ROUTE_KEY.ADMINISTRATION,
    icon: DashboardIcon,
  },
  {
    name: 'Questions',
    href: ROUTE_KEY.ADMINISTRATION_QUESTIONS,
    icon: QuizIcon,
    byRole: 'Admin',
  },
  {
    name: 'Assessments',
    href: ROUTE_KEY.ADMINISTRATION_ASSESSMENTS,
    icon: PendingActionsIcon,
  },
  {
    name: 'Settings',
    href: ROUTE_KEY.ADMINISTRATION_CONFIGURATION,
    icon: SettingsSuggestIcon,
    byRole: 'Admin',
  },
];

export type SideNavHandler = {
  toggleCollapse: () => void;
  collapseStatus: boolean;
};

const NavLinks = React.forwardRef<SideNavHandler, any>(({}, ref) => {
  const pathname = usePathname();
  const [collapse, toggleCollapse] = useState<boolean>(false);
  const { toggleNavCollapse } = useContext(DataContext);
  const { authData } = useContext(AuthContext);

  console.log('authData: ', authData);

  React.useImperativeHandle(ref, () => ({
    toggleCollapse: () => {
      toggleNavCollapse();
      toggleCollapse(!collapse);
    },
    collapseStatus: collapse,
  }));

  const handleRenderLink = (link: IMainLink, isShowSublinks?: boolean) => {
    const LinkIcon = link.icon;
    return (
      <Link
        key={link.name}
        href={link.href}
        className={clsx(
          'flex items-center justify-center gap-4 rounded-md p-4 text-sm hover:text-primary',
          pathname.includes(link.href) ? 'text-primary' : 'text-white',
        )}
      >
        <LinkIcon className="w-6" />
        <div
          style={{
            display: 'block',
            opacity: 1,
            transition: 'opacity 0.2s ease-in-out',
          }}
          className={clsx('w-2/3', {
            '!hidden opacity-0': collapse,
          })}
        >
          {link.name}
        </div>
        {link.sublinks?.length && (
          <div>
            {isShowSublinks ? (
              <ExpandLessIcon className="w-5" />
            ) : (
              <ExpandMoreIcon className="w-5" />
            )}
          </div>
        )}
      </Link>
    );
  };

  const handleRenderSublinks = (sublinks: ILink[]) => {
    return (
      <ul>
        {sublinks.map((sub: ILink, indx: number) => {
          return (
            <li key={sub.name + indx + ''} className="py-px">
              {handleRenderLink(sub)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className={clsx('nav-wrapper', {
        collapsed: collapse,
      })}
    >
      {links.map((link: IMainLink) => {
        const isShowSubs = pathname.includes(link.href);
        const mainLink = handleRenderLink(link, isShowSubs);
        return (
          <Fragment key={link.name}>
            {mainLink}
            {link.sublinks?.length && isShowSubs
              ? handleRenderSublinks(link.sublinks)
              : null}
          </Fragment>
        );
      })}
    </div>
  );
});

export default NavLinks;
