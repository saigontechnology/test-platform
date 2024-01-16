'use client';
import CustomRadioGroup from '@/app/components/atoms/CustomRadioGroup';
import CustomSingleSelect from '@/app/components/atoms/CustomSingleSelect';
import CustomModal, {
  CustomModalHandler,
} from '@/app/components/molecules/CustomModal';
import CustomTable from '@/app/components/molecules/CustomTable';
import { CategoriesOptions } from '@/app/constants/questions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const modalRef = React.useRef<CustomModalHandler>(null);

  return (
    <Box>
      <Box className="flex items-center justify-between">
        <Typography component="h1" className={`text-xl md:text-2xl`}>
          Questions
        </Typography>
        <Button
          variant="contained"
          onClick={(evt: React.MouseEvent) => {
            evt.preventDefault();
            router.push('/administrator/questions/create');
            // modalRef.current?.open()
          }}
        >
          <Typography>Create New Question</Typography>
        </Button>
      </Box>
      <Divider className="my-10" />
      <Box>
        <CustomTable />
      </Box>
      <CustomModal ref={modalRef} title="Create New Question">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomSingleSelect label="Category" options={CategoriesOptions} />
          </Grid>
          <Grid item xs={12}>
            <CustomRadioGroup />
          </Grid>
        </Grid>
        <Box className="mt-[20px] text-right">
          <Button
            onClick={() => modalRef.current?.close()}
            variant="outlined"
            className="hover:border-[#33b27f]"
            sx={{
              backgroundColor: '#FFFFFF !important',
              color: '#000000',
              borderColor: '#33b27f',
              marginRight: '10px',
            }}
          >
            Cancel
          </Button>
          <Button variant="contained">Save</Button>
        </Box>
      </CustomModal>
    </Box>
  );
}
