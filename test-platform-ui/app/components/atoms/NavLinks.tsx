'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import React from 'react';
import { Box, List, ListItem, SvgIconTypeMap } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import ExtensionIcon from '@mui/icons-material/Extension';
import ArchiveIcon from '@mui/icons-material/Archive';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { ROUTE_KEY } from '@/app/constants/routePaths';

interface ILink {
  name: string;
  href: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
}

interface IMainLink extends ILink {
  sublinks?: ILink[];
}

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links: IMainLink[] = [
  { name: 'Dashboard', href: ROUTE_KEY.ADMINISTRATION, icon: DashboardIcon },
  {
    name: 'Questions',
    href: ROUTE_KEY.ADMINISTRATION_QUESTIONS,
    icon: QuizIcon,
    sublinks: [
      {
        name: 'Create',
        href: ROUTE_KEY.ADMINISTRATION_QUESTIONS_CREATE,
        icon: ExtensionIcon,
      },
      {
        name: 'Archived',
        href: ROUTE_KEY.ADMINISTRATION_QUESTIONS_ARCHIVE,
        icon: ArchiveIcon,
      },
    ],
  },
  {
    name: 'Assessments',
    href: ROUTE_KEY.ADMINISTRATION_ASSESSMENTS,
    icon: PendingActionsIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const handleRenderLink = (link: IMainLink, isShowSublinks?: boolean) => {
    const LinkIcon = link.icon;
    return (
      <Link
        key={link.name}
        href={link.href}
        className={clsx(
          'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium text-white hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
          {
            'text-blue-600': pathname === link.href,
          },
        )}
      >
        <LinkIcon className="w-6" />
        <p className="hidden w-2/3 md:block">{link.name}</p>
        {link.sublinks?.length && (
          <Box>
            {isShowSublinks ? (
              <ExpandLessIcon className="w-5" />
            ) : (
              <ExpandMoreIcon className="w-5" />
            )}
          </Box>
        )}
      </Link>
    );
  };

  const handleRenderSublinks = (sublinks: ILink[]) => {
    return (
      <List>
        {sublinks.map((sub: ILink, indx: number) => {
          return (
            <ListItem key={sub.name + indx + ''} className="py-px">
              {handleRenderLink(sub)}
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Box>
      {links.map((link: IMainLink) => {
        const isShowSubs = pathname.includes(link.href);
        const mainLink = handleRenderLink(link, isShowSubs);
        return (
          <>
            {mainLink}
            {link.sublinks?.length && isShowSubs
              ? handleRenderSublinks(link.sublinks)
              : null}
          </>
        );
      })}
    </Box>
  );
}
