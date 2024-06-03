/* eslint-disable react/display-name */
'use client';

import RichTextArea from '@/components/atoms/Editor/richtext';
import { IResponseQuestion } from '@/constants/questions';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';
import RenderAnswer from '../(question-form)/answers/renderAnswer';
import Accordion, {
  FilterOpts,
  IAccordion,
  IOption,
} from './accordion/accordion';
import { _filterOpts } from './data';

const SettingContent = styled('div')`
  height: 100%;
  border-radius: 10px;
`;

const SettingButton = styled('button')`
  justify-content: center;
  display: inline-flex;
  position: relative;
`;

interface IGriSetting {
  onFilter: (checked: IOption[]) => void;
}

export type GriSettingHandler = {
  onPreview: (previewItem: IResponseQuestion) => void;
  close: () => void;
};

const GridSettings = forwardRef<GriSettingHandler, IGriSetting>(
  ({ onFilter }, ref) => {
    const [item, setPreviewItem] = useState<IResponseQuestion | null>(null);

    useImperativeHandle(ref, () => ({
      onPreview: (previewItem: IResponseQuestion) => {
        setPreviewItem(previewItem);
      },
      close: () => console.log(new Error('Function not implemented.')),
    }));

    const faqs: IAccordion[] = [
      {
        id: 1,
        header: 'Categories',
        render: () => (
          <FilterOpts
            options={_filterOpts}
            formLabel={null}
            onCheck={onFilter}
          />
        ),
      },
      {
        id: 2,
        header: 'Question Type',
        content: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. `,
      },
    ];

    return (
      <SettingContent className="relative flex h-[calc(100%_-_58px)] flex-col border-2 border-neutral-300 p-4">
        {item ? (
          <>
            <div className="flex justify-between px-3 pb-2">
              <p className="text-slate-400 ">#{item.id}</p>{' '}
              <SettingButton
                className="setting-buttons flex justify-end pb-4 pt-0"
                onClick={(evt: React.MouseEvent) => {
                  evt.preventDefault();
                  setPreviewItem(null);
                }}
              >
                <VisibilityOffIcon
                  className="fill-current text-neutral-600"
                  sx={{
                    width: 24,
                    height: 24,
                  }}
                />
              </SettingButton>
            </div>
            <div className="tf-overflow-scroll flex h-full w-full flex-col gap-3 overflow-auto px-3">
              <div className="flex flex-col gap-2">
                <p className="text-sm">Question</p>
                <div className="ml-3 grid gap-2 rounded-md border border-solid border-zinc-400 bg-white p-3 text-sm">
                  {item.question}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm">Description</p>
                <div className="ml-3 grid gap-2 rounded-md border border-solid border-zinc-400 bg-white p-3">
                  <RichTextArea
                    name="description"
                    data={item.description}
                    isReadOnly={true}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <p className="text-sm">Options</p>
                {item.options?.map((opt: string, indx: number) => (
                  <RenderAnswer
                    key={`${opt.length}-${indx}`}
                    answ={opt}
                    index={indx}
                    questionType={item.type}
                    isSelected={item.answer.includes(indx)}
                    readOnly={true}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <p className="text-sm">Explanation</p>
                <div className="ml-3 grid gap-2 rounded-md border border-solid border-zinc-400 bg-white p-3">
                  <RichTextArea
                    name="explanation"
                    data={item.notes || ''}
                    isReadOnly={true}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <Accordion data={faqs} />
        )}
      </SettingContent>
    );
  },
);

export default GridSettings;
