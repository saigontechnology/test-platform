/* eslint-disable react/display-name */
'use client';

import RichTextArea from '@/components/atoms/Editor/richtext';
import { IResponseQuestion } from '@/constants/questions';
import { useGetQuestionFilters } from '@/hooks/questions/hooks';
import { capitalizeFirstLetter } from '@/libs/utils';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';
import RenderAnswer from '../(question-form)/answers/renderAnswer';
import { getQuestionType } from '../(question-form)/preview';
import Accordion, {
  FilterOpts,
  IAccordion,
  IOption,
} from './accordion/accordion';

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
  onFilter: (key: string, checked: IOption[]) => void;
}

export type GriSettingHandler = {
  onPreview: (previewItem: IResponseQuestion) => void;
  close: () => void;
};

const GridSettings = forwardRef<GriSettingHandler, IGriSetting>(
  ({ onFilter }, ref) => {
    const [item, setPreviewItem] = useState<IResponseQuestion | null>(null);
    const [filtering, setFiltering] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({
      onPreview: (previewItem: IResponseQuestion) => {
        setPreviewItem(previewItem);
      },
      close: () => console.log(new Error('Function not implemented.')),
    }));

    const { data } = useGetQuestionFilters();
    const faqs = (): IAccordion[] => {
      return data
        ? Object.entries(data).map(([key, value], indx) => {
            const _filterOpts_ = (value as string[]).map(
              (_val: string, _indx: number) => {
                return { key: _val, value: getQuestionType(_val) };
              },
            );
            return {
              id: indx + 1,
              header: capitalizeFirstLetter(key),
              isFiltering: filtering.includes(key),
              render: () => (
                <FilterOpts
                  options={_filterOpts_}
                  formLabel={null}
                  onCheck={(checked: IOption[]) => {
                    setFiltering((prevState: string[]) => {
                      /** Case filter is checked */
                      if (checked.length) {
                        const addedKeys = !prevState.includes(key)
                          ? [...prevState, key]
                          : prevState;
                        return addedKeys;
                      } else {
                        /** Case filter on removed */
                        const removed = [...prevState];
                        removed.splice(removed.indexOf(key), 1);
                        return removed;
                      }
                    });
                    onFilter(key, checked);
                  }}
                />
              ),
            };
          })
        : [];
    };

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
          <div>
            <span className="px-3">Filter Options</span>
            <Accordion data={faqs()} />
          </div>
        )}
      </SettingContent>
    );
  },
);

export default GridSettings;
