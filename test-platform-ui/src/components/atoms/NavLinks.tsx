'use client';

import { ROUTE_KEY } from '@/constants/routePaths';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import QuizIcon from '@mui/icons-material/Quiz';
import { Box, List, ListItem, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

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
  {
    name: 'Dashboard',
    href: ROUTE_KEY.ADMINISTRATION,
    icon: DashboardIcon,
  },
  {
    name: 'Questions',
    href: ROUTE_KEY.ADMINISTRATION_QUESTIONS,
    icon: QuizIcon,
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
          'hover:text-primary flex items-center justify-center gap-4 rounded-md p-4 text-sm',
          pathname === link.href ? 'text-primary' : 'text-white',
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
          <Fragment key={link.name}>
            {mainLink}
            {link.sublinks?.length && isShowSubs
              ? handleRenderSublinks(link.sublinks)
              : null}
          </Fragment>
        );
      })}
    </Box>
  );
}
