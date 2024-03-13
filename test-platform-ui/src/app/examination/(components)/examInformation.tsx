import { Box, Chip, Typography } from '@mui/material';
import clsx from 'clsx';

type IExaminationInfo = {
  level: string;
  categories: string[];
  tailWindTextColor?: string;
};

const ExaminationInfo: React.FC<IExaminationInfo> = ({
  level,
  categories,
  tailWindTextColor,
}) => {
  return (
    <Box
      className={`${
        tailWindTextColor || 'text-white-primary'
      } m-3 grid gap-3.5`}
    >
      <Box className="flex gap-10">
        <Typography className={`${tailWindTextColor || 'text-white-primary'}`}>
          Level:
        </Typography>
        <Typography
          className={`${tailWindTextColor || 'text-white-primary'} pl-1`}
        >
          {level}
        </Typography>
      </Box>
      <Box className="flex content-start">
        <Typography
          className={`${tailWindTextColor || 'text-white-primary'} pb-3.5`}
        >
          Categories:
        </Typography>
        <Box className="grid gap-2 pl-8">
          {categories.map((cate, indx: number) => {
            return (
              <Chip
                className={clsx('w-fit max-w-sm bg-teal-500 text-white')}
                key={`answer-${indx}`}
                label={cate}
                variant="outlined"
                // onDelete={() => console.log('handle delete: ', params)}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ExaminationInfo;
