'use effect';

import CustomTextField from '@/components/atoms/CustomModules/CustomTextField';
import RichTextArea from '@/components/atoms/Editor/richtext';
import { QuestionLevels, QuestionType } from '@/libs/definitions';
import { capitalizeFirstLetter, millisToMinutesAndSeconds } from '@/libs/utils';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import StackedBarChartOutlinedIcon from '@mui/icons-material/StackedBarChartOutlined';
import {
  Box,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { IQuestionInfo } from '../../modifyQuestion';

interface IQuestionInterview {
  values: IQuestionInfo;
}

function getQuestionType(type: string) {
  switch (type) {
    case QuestionType.MULTIPLE_CHOICE:
      return 'Multiple Choice';
    case QuestionType.CODING:
      return 'Programming Skill';
    case QuestionType.LOGIC:
      return 'Programming Logic';
    case QuestionType.TRUE_FALSE:
      return 'True or False';
    default:
      return 'Single Choice';
  }
}

function getQuestionLevel(type: string) {
  switch (type) {
    case QuestionLevels.INTERMEDIATE:
      return 'Intermediate';
    case QuestionLevels.SENIOR:
      return 'Senior';
    case QuestionLevels.PRINCIPAL:
      return 'Principal';
    default:
      return 'Junior';
  }
}

function getQuestionCategory(type: string) {
  const typeToLower = ['JAVASCRIPT', 'TYPESCRIPT', 'REACT'];
  if (typeToLower.includes(type)) {
    return capitalizeFirstLetter(type);
  }
  return type;
}

export function QuestionPreview({ values }: IQuestionInterview) {
  return (
    <Stack
      gridTemplateColumns={'1fr fit-content(20%) 1fr'}
      display={'grid'}
      gap={4}
    >
      <Box>
        <CustomTextField
          name="question"
          customClass="ring-offset-0 w-full pb-4"
          multiline
          maxRows={3}
          isReadOnly={true}
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              event.preventDefault();
            }
          }}
        />
        <Stack gridTemplateColumns={'1fr 1fr'} display={'grid'} width={400}>
          <Typography
            className="flex justify-items-center gap-2 text-gray-400"
            variant="caption"
            display="block"
            gutterBottom
          >
            <DescriptionOutlinedIcon
              sx={{
                width: '16px',
                height: '16px',
              }}
            />
            {`Type: ${getQuestionType(values.type)}`}
          </Typography>
          <Typography
            className="flex justify-items-center gap-2 text-gray-400"
            variant="caption"
            display="block"
            gutterBottom
          >
            <CollectionsBookmarkOutlinedIcon
              sx={{
                width: '16px',
                height: '16px',
              }}
            />
            {`Skill: ${getQuestionCategory(values.category)}`}
          </Typography>
          <Typography
            className="flex justify-items-center gap-2 text-gray-400"
            variant="caption"
            display="block"
            gutterBottom
          >
            <StackedBarChartOutlinedIcon
              sx={{
                width: '16px',
                height: '16px',
              }}
            />
            {`Level: ${getQuestionLevel(values.level)}`}
          </Typography>
          <Typography
            className="flex justify-items-center gap-2 text-gray-400"
            variant="caption"
            display="block"
            gutterBottom
          >
            <AccessTimeIcon
              sx={{
                width: '16px',
                height: '16px',
              }}
            />
            {millisToMinutesAndSeconds(values.time) || '30s'}
          </Typography>
        </Stack>
        <Box className="pt-6">
          <RichTextArea
            key="questionDescriptionPreview"
            name="description"
            data={values.description}
            isReadOnly={true}
          />
        </Box>
        <Divider className="pb-6">
          <Typography variant="subtitle1">Explanation</Typography>
        </Divider>
        <RichTextArea
          key="questionDescriptionPreview"
          name="notes"
          data={values.notes}
          isReadOnly={true}
        />
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Box>
        <Divider className="pb-6">
          <Typography variant="subtitle1">Options</Typography>
        </Divider>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
        >
          {values.options?.map((opt, indx: number) => (
            <FormControlLabel
              key={opt}
              control={
                <Radio
                  key={`opt-${indx}`}
                  value={indx}
                  disabled
                  checked={values.answers.includes(indx)}
                />
              }
              label={opt}
              className="py-2"
            />
          ))}
        </RadioGroup>
      </Box>
    </Stack>
  );
}
