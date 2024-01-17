import { Breadcrumbs, Link, Typography } from "@mui/material";

export interface IBreadCrumbs {
    name: string,
    href: string
}

interface IPlatformBreadCrumbs {
    breadcrumbs: IBreadCrumbs[]
}

export default function PlatformBreadCrumbs (props: IPlatformBreadCrumbs) {
    const { breadcrumbs } = props;
    return (
        <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((link: IBreadCrumbs, indx: number) => {
                if(indx === breadcrumbs.length - 1 ) {
                    return (
                        <Typography 
                            key={`breadcrumb-${link.name}`} 
                            color="text.primary">
                                {link.name}
                        </Typography>
                    )
                }
                console.log('link.href: ', link);
                return (
                    <Link
                        key={`breadcrumbs-${link.name}`}
                        underline="hover"
                        color="inherit"
                        href={link.href}
                    >
                        {link.name}
                    </Link>
                )
            })}
        </Breadcrumbs>
    )
}