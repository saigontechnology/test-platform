'use client';

import {
  UserGroupIcon,
  PuzzlePieceIcon,
  ArchiveBoxArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import { Box, List, ListItem } from '@mui/material';

interface ILink {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
  } & RefAttributes<SVGSVGElement>>;
}

interface IMainLink extends ILink {
  sublinks?: ILink[]
}

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links: IMainLink[] = [
  { name: 'Dashboard', href: '/administrator', icon: HomeIcon },
  {
    name: 'Questions',
    href: '/administrator/questions',
    icon: UserGroupIcon,
    sublinks: [{
      name: 'Create',
      href: '/administrator/questions/create',
      icon: PuzzlePieceIcon,
    },{
      name: 'Archived',
      href: '/administrator/questions/archived',
      icon: ArchiveBoxArrowDownIcon,
    }]
  },
  {
    name: 'Assessment',
    href: '/administrator/assessments',
    icon: DocumentDuplicateIcon,
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
        <p className="hidden md:block w-2/3">{link.name}</p>
        {link.sublinks?.length && <Box>
          {isShowSublinks ?  <ChevronUpIcon className="w-5" /> : <ChevronDownIcon className="w-5" />}
        </Box>}
      </Link>
    )
  }

  const handleRenderSublinks = (sublinks: ILink[]) => {
    return (
      <List>
        {sublinks.map((sub: ILink, indx: number) => {
          return <ListItem key={sub.name + indx + ''} className="py-px">{handleRenderLink(sub)}</ListItem>
        })}
      </List>
    )
  };

  return (
    <Box>
      {links.map((link: IMainLink) => {
          const isShowSubs = pathname.includes(link.href);
          const mainLink = handleRenderLink(link, isShowSubs);
          return (
            <>
              {mainLink}
              {link.sublinks?.length && isShowSubs ? handleRenderSublinks(link.sublinks) : null}
            </>
          )
      })}
    </Box>
  );
}
