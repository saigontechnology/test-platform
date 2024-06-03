'use effect';

import { TitleWLine } from '@/components/atoms/CustomModules/AutocompleteTags/styles';
import CustomTextField from '@/components/atoms/CustomModules/CustomTextField';
import RichTextArea from '@/components/atoms/Editor/richtext';
import { QuestionLevels, QuestionType } from '@/libs/definitions';
import { capitalizeFirstLetter, formatTimeString } from '@/libs/utils';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import StackedBarChartOutlinedIcon from '@mui/icons-material/StackedBarChartOutlined';
import {
  Box,
  Divider,
  RadioGroup,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import RenderAnswer from '../answers/renderAnswer';

export function getQuestionType(type: string) {
  switch (type) {
    case QuestionType.MULTIPLE_CHOICE:
      return 'Multiple Choice';
    case QuestionType.CODING:
      return 'Programming Skill';
    case QuestionType.LOGIC:
    case QuestionType.PROGRAMMING_LOGIC:
      return 'Programming Logic';
    case QuestionType.TRUE_FALSE:
      return 'True or False';
    case QuestionType.SINGLE_CHOICE:
      return 'Single Choice';
    default:
      return type;
  }
}

export function getQuestionLevel(type: string) {
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

const ContentBackground = styled(Box)(
  () => `
    background-color: white;
    padding: 15px 20px;
    border-radius: 10px;
    border: solid 1px lightgrey;
  `,
);

function TitleWDivider({ title }: { title: string }): ReactElement {
  return (
    <TitleWLine variant="body1" className="py-4">
      <span className="bg-gray-50">{title}</span>
    </TitleWLine>
  );
}

export function QuestionPreview() {
  const { getValues } = useFormContext();
  const values = getValues();
  return (
    <Stack
      gridTemplateColumns={'1fr fit-content(20%) 1fr'}
      display={'grid'}
      gap={4}
    >
      <Box>
        <ContentBackground
          style={{
            margin: '20px 0px',
          }}
        >
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
              {formatTimeString(values.duration)}
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
        </ContentBackground>
        <TitleWDivider title="Explanation" />
        <ContentBackground>
          <RichTextArea
            key="questionDescriptionPreview"
            name="notes"
            data={values.notes}
            isReadOnly={true}
          />
        </ContentBackground>
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Box>
        <TitleWDivider title="Options" />
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          className="grid gap-4"
        >
          {values.options?.map((opt: string, indx: number) => (
            <RenderAnswer
              key={`${opt.length}-${indx}`}
              answ={opt}
              index={indx}
              questionType={values.type}
              isSelected={values.answers.includes(indx)}
              readOnly={true}
            />
          ))}
        </RadioGroup>
      </Box>
    </Stack>
  );
}
