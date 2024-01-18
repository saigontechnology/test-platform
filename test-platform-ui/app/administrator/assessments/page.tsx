import CustomTable from '@/app/components/molecules/CustomTable';
import { ROUTE_KEY } from '@/app/constants/routePaths';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default async function Page() {
  return (
    <Box>
      <Box className="mb-3 flex items-center justify-between">
        <Typography component="h1" className={`text-xl md:text-2xl`}>
          Assessments
        </Typography>
        <Link
          key={'Create New Question'}
          href={ROUTE_KEY.ADMINISTRATION_ASSESSMENTS_CREATE}
        >
          <Button variant="contained">
            <Typography>Create New Assessment</Typography>
          </Button>
        </Link>
      </Box>
      <Divider className="my-10" />
      <Box>
        <CustomTable />
      </Box>
    </Box>
  );
}
