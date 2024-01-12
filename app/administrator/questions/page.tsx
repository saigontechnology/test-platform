// import { lusitana } from '@/app/styles/fonts';
import Link from 'next/link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CustomTable from '@/app/components/CustomTable';
import clsx from 'clsx';

export default async function Page() {
  return (
    <Container>
      <Box className="mb-3 flex items-center justify-between">
        <Typography component="h1" className={`text-xl md:text-2xl`}>
          Questions
        </Typography>
        <Button variant="contained">
          <Link
            key={'Create New Question'}
            href={'/administrator/questions/create'}
          >
            <p className="hidden md:block">{'Create New Question'}</p>
          </Link>
        </Button>
      </Box>
      <Box>
        <CustomTable />
      </Box>
    </Container>
  );
}
