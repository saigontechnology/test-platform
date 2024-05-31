import RichTextArea from '@/components/atoms/Editor/richtext';
import FlagChip from './components/flag-chip/flagChip';

import React, { useMemo } from 'react';
import './styles.scss';

export interface ICardData {
  id: number;
  title: string;
  tags?: string[];
  flagChip?: {
    label: string;
  };
  description: {
    content: string;
    render?: () => React.ReactElement;
  };
  cardInfo: {
    info: string[];
    render?: (info?: string) => React.ReactElement;
  };
  actions?: React.ReactElement | null;
}

interface IGridCard {
  key: string;
  active?: boolean;
  cardData: ICardData;
}

function ListCardItem({
  key,
  active,
  cardData,
}: IGridCard): React.ReactElement {
  const handleCSRender = useMemo(() => {
    if (cardData.cardInfo.render) {
      return cardData.cardInfo.render();
    }
    return cardData.cardInfo.info?.map((info: string, indx: number) => (
      <span key={`card-info-${indx}`} className="info-chip">
        {info}
      </span>
    ));
  }, [cardData]);

  return (
    <div
      key={key}
      className={`items-container ${cardData.id} ${active ? 'active' : ''}`}
    >
      <div className="question-title">
        <div className="title">
          <span className="p-2 !font-light text-slate-400">#{cardData.id}</span>
          {cardData.title}
        </div>
        {cardData.flagChip ? (
          <FlagChip label={cardData.flagChip.label} />
        ) : null}
      </div>
      <div className="tag-chip-container">
        {cardData.tags?.map((tag: string, indx: number) => (
          <span key={`tag-${indx}`} className="tag-chip-item">
            {tag}
          </span>
        ))}
      </div>
      {cardData.description?.content ? (
        <div className="question-description">
          {cardData.description?.render ? (
            cardData.description.render()
          ) : (
            <RichTextArea
              name="description"
              data={cardData.description.content}
              onChange={(_val: string) => null}
              isReadOnly={true}
            />
          )}
        </div>
      ) : null}
      <div className="info-container flex justify-between">
        <div className="flex gap-4">{handleCSRender}</div>
        <div className="flex items-center justify-center">
          {cardData.actions ? cardData.actions : null}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ListCardItem);
