import { QuestionType } from '@/libs/definitions';
import { Box } from '@mui/material';
import ModifyQuestion from '../(components)/modifyQuestion';

const CreateQuestion = () => {
  return (
    <Box>
      <ModifyQuestion
        questionData={{
          id: 0,
          question: '',
          description: '',
          notes: '',
          categories: [],
          answers: [],
          options: [],
          level: '',
          type: QuestionType.SINGLE_CHOICE,
        }}
      />
    </Box>
  );
};

export default CreateQuestion;
