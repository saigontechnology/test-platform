// import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material';
import { useState } from 'react';
import { GridItems, GridTool } from './components/grid-skeleton';
import PageSizeDropdown from './components/page-size';
import TFPagination from './components/pagination';
import SearchBar from './components/searchBar';
import ListCardItem, { ICardData } from './listItem';

const Grid = styled('div')`
  display: grid;
  gap: 10px;
  height: inherit;
  overflow-y: auto;
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
  handlePageSize,
  handleOnSearch,
  handleSearchClear,
  placeholder,
  itemActions,
  totalItems,
  isLoading,
}: {
  data: ICardData[];
  defaultPageSize: number;
  currPage: number;
  handlePageChange: (currentPage: number) => void;
  handlePageSize: (pageSize: number) => void;
  handleOnSearch: (searchVal: string) => void;
  handleSearchClear: () => void;
  placeholder?: string;
  itemActions?: (itemId: number) => React.ReactElement;
  isLazyLoad?: boolean;
  totalItems: number;
  isLoading: boolean;
}) {
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const GridPagination = ({ itemPerPage }: { itemPerPage: number }) => {
    return (
      <TFPagination
        className="pagination-bar"
        currentPage={currPage}
        totalCount={totalItems}
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
    handlePageSize(newPageSize);
  };

  return (
    <div className="question-list h-[inherit] gap-2">
      {data.length && totalItems ? (
        <GridToolBar className="grid-tool-bar ml-4 flex h-12 justify-between rounded-lg bg-neutral-200 p-1">
          {placeholder?.length ? (
            <SearchBar
              placeholder={placeholder!}
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
      ) : (
        <GridTool />
      )}
      {!isLoading ? (
        <Grid className="grid-items tf-overflow-scroll mt-3.5 grid h-[calc(100%_-_70px)] auto-rows-max gap-1">
          {data?.map((_data: any, _indx: number) => {
            const _cardData = itemActions
              ? { ..._data, actions: itemActions(_data.id) }
              : _data;
            return (
              <ListCardItem key={`question-${_indx}`} cardData={_cardData} />
            );
          })}
        </Grid>
      ) : (
        <GridItems />
      )}
    </div>
  );
}
