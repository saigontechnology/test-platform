import React, { useCallback, useEffect, useRef, useState } from 'react';
import ListCardItem from './listItem';

const LazyLoadList = ({
  items,
  itemsPerPage = 10,
  containerSelector,
  cardActions,
}: {
  items: any[];
  itemsPerPage: number;
  containerSelector: string;
  cardActions?: (itemId: number) => React.ReactElement;
}) => {
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const observerRef = useRef<any>(null);
  const lastItemRef = useRef<any>(null);

  // Function to load more items
  const loadMoreItems = useCallback(() => {
    const currentLength = visibleItems.length;
    const newItems = items.slice(currentLength, currentLength + itemsPerPage);
    setVisibleItems((prevItems: any) => [...prevItems, ...newItems]);
  }, [visibleItems, items, itemsPerPage]);

  useEffect(() => {
    const options = {
      root: document.querySelector(containerSelector), // Use the viewport as the root
      rootMargin: '0px 0px 100px 0px',
      threshold: 0.1, // Trigger when 10% of the target is visible
    };

    const observerCallback = (entries: any) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        loadMoreItems();
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, options);

    if (lastItemRef.current) {
      observerRef.current.observe(lastItemRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreItems]);

  useEffect(() => {
    if (lastItemRef.current) {
      observerRef.current.observe(lastItemRef.current);
    }
  }, [visibleItems]);

  return (
    <div className="wrapper-lazy-list">
      <div>
        {visibleItems?.map((_data: any, _indx: number) => {
          const _cardData = cardActions
            ? { ..._data, actions: cardActions(_data.id) }
            : _data;
          return (
            <ListCardItem key={`question-${_indx}`} cardData={_cardData} />
          );
        })}
      </div>
      <div ref={lastItemRef} style={{ height: '20px' }} />
    </div>
  );
};

export default React.memo(LazyLoadList);
