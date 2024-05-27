import RichTextArea from '@/components/atoms/Editor/richtext';
import { FlagChip } from './flag-chip/flagChip';

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
}

interface IGridCard {
  key: string;
  active?: boolean;
  cardData: ICardData;
}

export default function ListCardItem({
  key,
  active,
  cardData,
}: IGridCard): React.ReactElement {
  const handleCSRender = () => {
    if (cardData.cardInfo.render) {
      return cardData.cardInfo.render();
    }
    return cardData.cardInfo.info?.map((info: string, indx: number) => (
      <span key={`card-info-${indx}`} className="info-chip">
        {info}
      </span>
    ));
  };

  return (
    <div key={key} className={`items-container ${active ? 'active' : ''}`}>
      <div className="question-title">
        <div className="title">{cardData.title}</div>
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
      <div className="info-container flex gap-4">{handleCSRender()}</div>
    </div>
  );
}
