import { CSButton } from '@/components/organisms/Button';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

/** Modal content to warning examination expired */
const ModalExpired: React.FC = () => {
  const router = useRouter();
  return (
    <Box className="grid p-4">
      <Typography className="whitespace-pre-line pb-6">
        {`Your examination link is expired or not existed. Please contact with our HR department for more details {HRDepartment}. Thanks for your time.`}
      </Typography>
      <CSButton
        customClass="mx-auto text-lg"
        label="Close Examination"
        onClick={() => router.replace('/')}
      />
    </Box>
  );
};

export default ModalExpired;
