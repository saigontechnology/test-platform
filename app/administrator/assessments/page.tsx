import { lusitana } from '@/app/styles/fonts';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CustomTable from '@/app/components/CustomTable';

export default async function Page() {
  return (
    <Container>
      <Box className="mb-3 flex items-center justify-between">
        <Typography component="h1" className={`text-xl md:text-2xl`}>
          Assessments
        </Typography>
        <Button variant="contained">
          <Typography>Create New Assessment</Typography>
        </Button>
      </Box>
      <Box>
        <CustomTable />
      </Box>
    </Container>
  );
}
