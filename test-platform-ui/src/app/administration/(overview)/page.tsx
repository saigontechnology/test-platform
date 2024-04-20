import { Box, Divider, Typography } from '@mui/material';
import DashboardGrid from './(components)/grid';

export default async function Page() {
  return (
    <Box>
      <Box className="flex items-center justify-between">
        <Typography component="h1" className={`text-xl md:text-2xl`}>
          Dashboard
        </Typography>
      </Box>
      <Divider className="my-10" />
      <DashboardGrid />
    </Box>
  );
}
