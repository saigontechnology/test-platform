import { styled } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ListCardItem, { ICardData } from './listItem';
import TFPagination from './pagination';

const Grid = styled('div')`
  display: grid;
  gap: 10px;
  height: inherit;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 30px;
  }
  &::-webkit-scrollbar-thumb {
    background: #8888889c;
    border-radius: 30px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555555a3;
  }
`;
const GridPaging = styled('div')`
  margin: 0px 10px 0px;
  & > ul.pagination-container {
    place-content: flex-end;
  }
`;
const GridDivider = styled('hr')`
  padding: 0px 0px 0px 10px;
  &.dashed {
    border-top: 3px dashed #bbb;
  }
  &.solid {
    border-top: 3px solid #bbb;
  }
  &.rounded {
    border-top: 8px solid #bbb;
    border-radius: 5px;
  }
`;

export default function TFGrid({
  data,
  paging,
  currPage = 1,
  handlePageChange,
}: {
  data: ICardData[];
  paging: number;
  currPage: number;
  handlePageChange: (currentPage: number) => void;
}) {
  const itemCounter: number = paging - 1;
  const [chunkedData, setChunkedData] = useState<ICardData[][]>([]);

  /** Reference:
   *   https://www.30secondsofcode.org/js/s/split-array-into-chunks/#:~:text=Split%20
   *   array%20into%20chunks%20of%20a%20given%20size&text=This%20can%20be%20calculated%20by,from()%20.
   */
  const chunkItems = useMemo(() => {
    const chunked = Array.from(
      { length: Math.ceil(data.length / paging) },
      (_item: ICardData, indx: number) => {
        const _r = data.slice(indx * paging, indx * paging + paging);
        console.log('chunk sliced: ', _r);
        return _r;
      },
    );
    setChunkedData(chunked);
  }, [data]);

  useEffect(() => {
    chunkItems;
  }, [data]);

  const GridPagination = ({ itemPerPage }: { itemPerPage: number }) => {
    return (
      <GridPaging className="ml-4 rounded-lg bg-stone-200 p-1">
        <TFPagination
          className="pagination-bar"
          currentPage={currPage}
          totalCount={chunkedData?.length}
          pageSize={itemPerPage}
          onPageChange={(page: string | number) => {
            if (typeof page === 'number') {
              handlePageChange(page);
            }
          }}
          siblingCount={0}
        />
      </GridPaging>
    );
  };

  return (
    <div className="question-list grid h-[inherit] gap-2">
      <GridPagination itemPerPage={3} />
      {/* <GridDivider className="solid" /> */}
      <Grid className="grid gap-1">
        {chunkedData[currPage]?.map((_data: any, _indx: number) => {
          if (_indx <= itemCounter) {
            return (
              <ListCardItem
                key={`question-${_indx}-${uuidv4()}`}
                cardData={_data}
              />
            );
          }
        })}
      </Grid>
    </div>
  );
}
