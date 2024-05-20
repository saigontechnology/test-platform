/* eslint-disable react/no-unescaped-entities */
import { CSButton } from '@/components/organisms/Button';
import { Alert, Box, Input, Paper, Stack, Typography } from '@mui/material';
import { Dispatch, useEffect } from 'react';

interface IPaperContent<T> {
  isDisabled: boolean;
  onChanged: boolean;
  error?: string;
  setStateEmail: Dispatch<React.SetStateAction<T>>;
  gotoExam: () => void;
}
// Notice: the trailing comma after T
export const PaperContent = <T,>({
  setStateEmail,
  gotoExam,
  isDisabled,
  onChanged,
  error,
}: IPaperContent<T>) => {
  useEffect(() => {
    console.log('Error: ', error);
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: '10vh',
        '& > :not(style)': {
          m: 1,
          width: '50%',
          height: 'max-content',
        },
      }}
    >
      <Paper elevation={3} square={false} className="p-6">
        <Typography className="pb-4 text-lg font-semibold">Rules:</Typography>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        <Typography className="pt-5">
          Please fill in below field with your email to confirmation.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          className="flex items-start justify-between pt-5"
        >
          <Stack>
            <Input
              className="w-[350px]"
              placeholder="Candidate Email"
              onChange={(evt: any) => {
                evt.preventDefault();
                setStateEmail(evt.target.value);
              }}
            />
            {onChanged && isDisabled ? (
              <Typography className="pt-2 text-sm text-red-500">
                Email not match with email pattern
              </Typography>
            ) : null}
          </Stack>
          <CSButton
            label="Go to Examination"
            onClick={gotoExam}
            isDisabled={isDisabled}
          />
        </Stack>
        {error?.length ? (
          <Alert className="mt-6" severity="warning">
            {error}
          </Alert>
        ) : null}
      </Paper>
    </Box>
  );
};
