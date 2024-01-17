import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CustomTable from '@/app/components/molecules/CustomTable';
import Divider from '@mui/material/Divider';

export default async function Page() {
  return (
    <Box>
      <Box className="mb-3 flex items-center justify-between">
        <Typography component="h1" className={`text-xl md:text-2xl`}>
          Assessments
        </Typography>
        <Button variant="contained">
          <Typography>Create New Assessment</Typography>
        </Button>
      </Box>
      <Divider className="my-10" />
      <Box>
        <CustomTable />
      </Box>
    </Box>
  );
}
