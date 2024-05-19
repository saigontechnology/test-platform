import { Box } from '@mui/material';
import DashboardGrid from './(components)/grid';

export default async function Page() {
  return (
    <Box className="bg-white p-4">
      {/* <Box className="flex items-center justify-between">
        <Typography component="h1">Dashboard</Typography>
      </Box> */}
      {/* <Divider className="my-4" /> */}
      <DashboardGrid />
    </Box>
  );
}
