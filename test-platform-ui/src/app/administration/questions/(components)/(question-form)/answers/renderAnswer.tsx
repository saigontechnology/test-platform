import RichTextArea from '@/components/atoms/Editor/richtext';
import { QuestionType } from '@/libs/definitions';
import { AddBox, Delete, Done, ModeEditOutline } from '@mui/icons-material';
import { Box, Checkbox, FormControl, IconButton, Radio } from '@mui/material';
import { ReactElement, useRef, useState } from 'react';
import ReactQuill from 'react-quill';

const RenderAnswer = ({
  answ,
  index,
  isSelected,
  questionType = QuestionType.SINGLE_CHOICE,
  customClass = '',
  readOnly = false,
  updateAnswerContent,
  selectAnswer,
}: {
  answ: string;
  index: number;
  isSelected: boolean;
  questionType?: QuestionType;
  customClass?: string;
  readOnly?: boolean;
  updateAnswerContent?: (value: string, index: number) => void;
  selectAnswer?: (index: number) => void;
}): ReactElement => {
  const [isEditable, toggleEditable] = useState<boolean>(false);
  const onEditQuillRef = useRef<ReactQuill | null>(null);

  const handleUpdateAnswer = () => {
    if (onEditQuillRef.current?.value && updateAnswerContent) {
      updateAnswerContent(onEditQuillRef.current?.value as string, index);
      onEditQuillRef.current = null;
    }
  };

  const renderOptionType = (answSelected: boolean) => {
    console.log(`${index} isSelected: `, answSelected);
    switch (questionType) {
      case QuestionType.SINGLE_CHOICE:
        return (
          <Radio
            checked={answSelected}
            disableRipple
            disabled={readOnly}
            onClick={() => {
              console.log('Radio on click');
              selectAnswer && selectAnswer(index);
            }}
          />
        );
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <Checkbox
            checked={answSelected}
            disabled={!readOnly}
            disableRipple
            onClick={() => {
              console.log('Checkbox on click');
              selectAnswer && selectAnswer(index);
            }}
          />
        );
    }
  };

  return (
    <FormControl
      key={`answer-${answ.length}`}
      variant="standard"
      className={`ml-3 inline-flex !flex-row items-center ${customClass}`}
      sx={{
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '10px',
        border: 'solid 1px lightgrey',
        width: 'calc(100% - 30px)',
      }}
    >
      {renderOptionType(isSelected)}
      {/** Notes:
       *    - Specific cases answer include code patterns, simply envision the answer contents.
       */}
      <RichTextArea
        key="questionAnswersPreview"
        data={answ}
        isReadOnly={!isEditable}
        onChange={(_value: string, ref: ReactQuill) =>
          (onEditQuillRef.current = ref)
        }
      />

      {/** Answer's action buttons:
       *    - Edit: toggle on richtext area in edit mode
       *    - Delete: delete answer
       *    - Done: toggle off and save answer edited value
       */}
      {answ.length > 0 && !readOnly ? (
        <>
          {answ ? (
            // Edit answer
            <div className="answer-actions-wrapper flex justify-around gap-2 p-2">
              <IconButton
                color={isEditable ? 'success' : 'default'}
                onClick={() => {
                  isEditable && handleUpdateAnswer();
                  toggleEditable(!isEditable);
                }}
                type="button"
              >
                {isEditable ? <Done /> : <ModeEditOutline />}
              </IconButton>
              <IconButton color="error" type="button">
                <Delete />
              </IconButton>
            </div>
          ) : (
            // Add new answer
            <Box>
              {isEditable ? (
                <IconButton
                  color="success"
                  onClick={() => {
                    toggleEditable(false);
                  }}
                  type="button"
                >
                  <Done />
                </IconButton>
              ) : (
                <IconButton
                  color="primary"
                  onClick={() => toggleEditable(true)}
                  type="button"
                >
                  <AddBox />
                </IconButton>
              )}
            </Box>
          )}
        </>
      ) : null}
    </FormControl>
  );
};

export default RenderAnswer;
