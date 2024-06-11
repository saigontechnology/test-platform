/* eslint-disable react/display-name */
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from '@mui/material';
import React, { useRef, useState } from 'react';

import './styles.scss';

export interface IAccordion {
  id: number;
  header: string;
  content?: string;
  isFiltering?: boolean;
  render?: () => React.ReactNode;
}

const AccordionItem = (props: any) => {
  const contentEl = useRef<any | null>(null);
  const { handleToggle, active, faq } = props;
  const { header, id, content, render, isFiltering } = faq;

  return (
    <div className="rc-accordion-card">
      <div className="rc-accordion-header">
        <div
          className={`rc-accordion-toggle p-3 ${active === id || isFiltering ? 'active' : ''}`}
          onClick={() => handleToggle(id)}
        >
          <h5 className="rc-accordion-title">{header}</h5>
          <ExpandMoreIcon
            className="rc-accordion-icon"
            sx={{
              width: '24px',
              height: '24px',
            }}
          />
        </div>
      </div>
      <div
        ref={contentEl}
        className={`rc-collapse ${active === id ? 'show' : ''}`}
        style={
          active === id
            ? { height: contentEl.current?.scrollHeight }
            : { height: '0px' }
        }
      >
        <div className="rc-accordion-body">
          {content?.length ? <p className="mb-0">{content}</p> : null}
          {render ? render() : null}
        </div>
      </div>
    </div>
  );
};

export interface IOption {
  key: string;
  value: string;
}

export type FilterOptionsHandler = {
  getSelectedOpts: IOption[];
};

interface IFilterOpts {
  formLabel: string | null;
  options: IOption[];
  onCheck: (checked: IOption[]) => void;
}

export const FilterOpts = ({
  options,
  formLabel = null,
  onCheck,
}: IFilterOpts) => {
  const [selectedOpts, setSelectedOpts] = useState<IOption[]>([]);

  return (
    <FormControl
      sx={{ p: 1 }}
      component="fieldset"
      variant="standard"
      className="grid w-full"
    >
      {formLabel ? <FormLabel component="legend">{formLabel}</FormLabel> : null}
      <FormGroup
        className="relative grid gap-x-32 gap-y-2.5 overflow-hidden"
        sx={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gridTemplateRows: 'auto',
        }}
      >
        {options.map((opt: any, _indx: number) => {
          const isChecked: boolean = selectedOpts.find(
            (_opt: IOption) => _opt.key === opt.key,
          )
            ? true
            : false;
          return (
            <FormControlLabel
              key={`filter-option-${opt.key}`}
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={(
                    _evt: React.ChangeEvent<HTMLInputElement>,
                    checked: boolean,
                  ) => {
                    const _tempItems = [...selectedOpts];
                    if (!checked) {
                      const removeIndx = _tempItems.findIndex(
                        (_opt) => _opt.key === opt.key,
                      );
                      _tempItems.splice(removeIndx, 1);
                      setSelectedOpts(_tempItems);
                      onCheck(_tempItems);
                    } else {
                      setSelectedOpts(_tempItems.concat(opt));
                      onCheck(_tempItems.concat(opt));
                    }
                  }}
                  name={opt.key}
                  disableRipple
                />
              }
              label={opt.value}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

export default function TFAccordion({ data }: { data: any }) {
  const [active, setActive] = useState<number | null>(1);

  const handleToggle = (index: number) => {
    console.log('handleToggle: ', index);
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  };

  return (
    <div className="card-body pt-[20px]">
      {data.map((_d: any, index: number) => {
        return (
          <AccordionItem
            key={index}
            active={active}
            handleToggle={handleToggle}
            faq={_d}
          />
        );
      })}
    </div>
  );
}
