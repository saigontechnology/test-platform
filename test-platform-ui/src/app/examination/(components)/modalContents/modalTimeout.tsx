import { CSButton } from '@/components/organisms/Button';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

/** Modal content to warning examination timeout */
const ModalTimeoutContent: React.FC = () => {
  const router = useRouter();
  return (
    <Box className="grid p-4">
      <Typography className="whitespace-pre-line pb-6">
        {`Your examination is timeout. Result will be send via email ${sessionStorage.candidateEmail}. \n  Thanks you time to join examination.`}
      </Typography>
      <CSButton
        customClass="mx-auto text-lg"
        label="Exit examination"
        onClick={() => router.replace('/')}
      />
    </Box>
  );
};

export default ModalTimeoutContent;
