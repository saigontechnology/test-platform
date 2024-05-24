import { FlagChip } from './flag-chip/flagChip';

import './styles.scss';

interface ICardData {
  title: string;
  tags?: string[];
  flagChip?: {
    label: string;
  };
  description: {
    label: string;
    content: string;
    render?: () => React.ReactElement;
  };
  cardInfo: {
    render?: () => React.ReactElement;
  };
}

interface IGridCard {
  active?: boolean;
  cardData: ICardData;
}

export default function ListCardItem({
  active,
  cardData,
}: IGridCard): React.ReactElement {
  return (
    <div className={`items-container ${active ? 'active' : ''}`}>
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
      {cardData.description?.label && cardData.description?.content ? (
        <div className="question-description">
          {cardData.description?.render ? (
            cardData.description.render()
          ) : (
            <>
              <div>{cardData.description?.label}</div>
              <div>{cardData.description?.content}</div>
            </>
          )}
        </div>
      ) : null}
      <div className="info-container flex gap-4">
        {cardData.cardInfo?.render ? cardData.cardInfo.render() : null}
      </div>
    </div>
  );
}
