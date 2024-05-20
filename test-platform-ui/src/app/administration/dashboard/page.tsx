import { Box } from '@mui/material';
import DashboardGrid from './(components)/grid';

export default async function Page() {
  return (
    <Box className="bg-white p-4">
      <DashboardGrid />
    </Box>
  );
}
