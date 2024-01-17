'use client';
import CustomSingleSelect from '@/app/components/atoms/CustomSingleSelect';
import CustomTextField from '@/app/components/atoms/CustomTextField';
import { LevelOptions } from '@/app/constants/assessments';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Page() {
  return (
    <Box>
      <Box className="mb-3 flex items-center justify-between">
        <Typography component="h1" className={`text-xl md:text-2xl`}>
          Create Assessment
        </Typography>
      </Box>
      <Divider className="my-10" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomTextField label="Name" />
        </Grid>
        <Grid item xs={12}>
          <CustomSingleSelect label="Level" options={LevelOptions} />
        </Grid>
      </Grid>
      <Box className="mt-[20px] text-right">
        <Button variant="outlined" className="mr-[10px]">
          Cancel
        </Button>
        <Button variant="contained">Save</Button>
      </Box>
    </Box>
  );
}
