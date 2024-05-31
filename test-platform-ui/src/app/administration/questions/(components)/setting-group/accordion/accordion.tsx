import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Checkbox } from '@mui/material';
import React, { useRef, useState } from 'react';

import './styles.scss';

interface IAccordion {
  id: number;
  header: string;
  content: string;
  render?: () => React.ReactNode;
}

const AccordionItem = (props: any) => {
  const contentEl = useRef<any | null>(null);
  const { handleToggle, active, faq } = props;
  const { header, id, content, render } = faq;

  return (
    <div className="rc-accordion-card">
      <div className="rc-accordion-header">
        <div
          className={`rc-accordion-toggle p-3 ${active === id ? 'active' : ''}`}
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
            ? { height: contentEl.current.scrollHeight }
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

export default function TFAccordion() {
  const [active, setActive] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  };

  return (
    <div className="card-body pt-[26px]">
      {faqs.map((faq, index) => {
        return (
          <AccordionItem
            key={index}
            active={active}
            handleToggle={handleToggle}
            faq={faq}
          />
        );
      })}
    </div>
  );
}

const faqs: IAccordion[] = [
  {
    id: 1,
    header: 'Categories',
    content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
    render: () => {
      const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
      return (
        <div>
          <Checkbox {...label} defaultChecked />
          <Checkbox {...label} />
          <Checkbox {...label} disabled />
          <Checkbox {...label} disabled checked />
        </div>
      );
    },
  },
  {
    id: 2,
    header: 'Question Type',
    content: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. `,
  },
];
