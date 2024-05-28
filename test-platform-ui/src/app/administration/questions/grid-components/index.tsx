// import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PageSizeDropdown from './components/page-size';
import TFPagination from './components/pagination';
import SearchBar from './components/searchBar';
import ListCardItem, { ICardData } from './listItem';

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
const GridToolBar = styled('div')`
  margin: 0px 10px 0px;
  & > ul.pagination-container {
    place-content: flex-end;
  }
`;

export default function TFGrid({
  data,
  defaultPageSize,
  currPage = 1,
  handlePageChange,
  handleOnSearch,
  handleSearchClear,
  placeholder,
  itemActions,
}: {
  data: ICardData[];
  defaultPageSize: number;
  currPage: number;
  handlePageChange: (currentPage: number) => void;
  handleOnSearch: (searchVal: string) => void;
  handleSearchClear: () => void;
  placeholder?: string;
  itemActions?: (itemId: number) => React.ReactElement;
}) {
  const [chunkedData, setChunkedData] = useState<ICardData[][]>([]);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  /** Reference:
   *   https://www.30secondsofcode.org/js/s/split-array-into-chunks/#:~:text=Split%20
   *   array%20into%20chunks%20of%20a%20given%20size&text=This%20can%20be%20calculated%20by,from()%20.
   */
  useMemo(() => {
    const chunked = Array.from(
      { length: Math.ceil(data.length / pageSize) },
      (_item: ICardData, indx: number) => {
        const _r = data.slice(indx * pageSize, indx * pageSize + pageSize);
        return _r;
      },
    );
    setChunkedData(chunked);
  }, [data, pageSize]);

  const GridPagination = ({ itemPerPage }: { itemPerPage: number }) => {
    return (
      <TFPagination
        className="pagination-bar"
        currentPage={currPage}
        totalCount={data.length}
        pageSize={itemPerPage}
        onPageChange={(page: string | number) => {
          if (typeof page === 'number') {
            handlePageChange(page);
          }
        }}
        siblingCount={1}
      />
    );
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  return (
    <div className="question-list grid h-[inherit] gap-2">
      <GridToolBar className="grid-tool-bar ml-4 flex justify-between rounded-lg bg-neutral-200 p-1">
        {placeholder?.length ? (
          <SearchBar
            placeholder={placeholder}
            onSearch={handleOnSearch}
            onClear={handleSearchClear}
          />
        ) : (
          <div />
        )}
        <div className="flex gap-4">
          <GridPagination itemPerPage={pageSize} />
          <PageSizeDropdown
            options={[5, 10, 20, 30, 50]}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </GridToolBar>
      <Grid className="grid gap-1">
        {chunkedData[currPage - 1]?.map((_data: any, _indx: number) => {
          const _cardData = itemActions
            ? { ..._data, actions: itemActions(_data.id) }
            : _data;
          return (
            <ListCardItem
              key={`question-${_indx}-${uuidv4()}`}
              cardData={_cardData}
            />
          );
        })}
      </Grid>
    </div>
  );
}
