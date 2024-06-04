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
  modifyAnswerContent,
  onDelete,
  selectAnswer,
}: {
  answ: string;
  index: number;
  isSelected: boolean;
  questionType?: QuestionType;
  customClass?: string;
  readOnly?: boolean;
  modifyAnswerContent?: (value: string, index: number) => void;
  onDelete?: (indx: number) => void;
  selectAnswer?: (index: number) => void;
}): ReactElement => {
  const [isEditable, toggleEditable] = useState<boolean>(false);
  const onEditQuillRef = useRef<ReactQuill | null>(null);

  const handleUpdateAnswer = () => {
    if (onEditQuillRef.current?.value && modifyAnswerContent) {
      modifyAnswerContent(onEditQuillRef.current?.value as string, index);
      onEditQuillRef.current = null;
    }
  };

  const renderOptionType = (answSelected: boolean) => {
    switch (questionType) {
      case QuestionType.SINGLE_CHOICE:
        return (
          <Radio
            checked={answSelected}
            disableRipple
            disabled={readOnly}
            onClick={() => {
              selectAnswer && selectAnswer(index);
            }}
          />
        );
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <Checkbox
            checked={answSelected}
            disabled={readOnly}
            disableRipple
            onClick={() => {
              selectAnswer && selectAnswer(index);
            }}
          />
        );
    }
  };

  const renderAddAnswer = () => {
    return (
      <Box>
        {isEditable ? (
          <IconButton
            color="success"
            onClick={() => {
              handleUpdateAnswer();
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
    );
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
      {answ.length ? renderOptionType(isSelected) : null}
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
                  handleUpdateAnswer();
                  toggleEditable(!isEditable);
                }}
                type="button"
              >
                {isEditable ? <Done /> : <ModeEditOutline />}
              </IconButton>
              <IconButton
                color="error"
                type="button"
                onClick={() => onDelete?.(index)}
              >
                <Delete />
              </IconButton>
            </div>
          ) : (
            // Add new answer
            renderAddAnswer()
          )}
        </>
      ) : !readOnly ? (
        renderAddAnswer()
      ) : null}
    </FormControl>
  );
};

export default RenderAnswer;
