'use effect';

import { TitleWLine } from '@/components/atoms/CustomModules/AutocompleteTags/styles';
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
  styled,
} from '@mui/material';
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

const ContentBackground = styled(Box)(
  () => `
    background-color: white;
    padding: 15px 20px;
    border-radius: 10px;
    border: solid 1px lightgrey;
  `,
);

export function QuestionPreview({ values }: IQuestionInterview) {
  const TitleWDivider = ({ title }: { title: string }) => {
    return (
      <TitleWLine variant="body1" className="py-4">
        <span className="bg-gray-50">{title}</span>
      </TitleWLine>
    );
  };

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
          sx={{
            backgroundColor: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'solid 1px lightgrey',
          }}
        >
          {values.options?.map((opt, indx: number) => (
            <FormControlLabel
              key={opt}
              control={
                <Radio
                  key={`opt-${indx}`}
                  value={indx}
                  readOnly={true}
                  checked={values.answers.includes(indx)}
                />
              }
              label={opt}
              className="py-2 [&>span]:text-sm [&_*]:pointer-events-none"
              sx={{
                '&~*:hover': {
                  cursor: 'default',
                },
              }}
            />
          ))}
        </RadioGroup>
      </Box>
    </Stack>
  );
}
