import clsx from 'clsx';
import './styles.scss';
import { DOTS, usePagination } from './usePagination';

interface IPagination {
  onPageChange: (targetPage: number | string) => void;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
  className: string;
}

const TFPagination = (props: IPagination) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  } = props;

  const paginationRange: any = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange?.length < 2) {
    return null;
  }
  const lastPage = paginationRange[paginationRange.length - 1];

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  console.log('paginationRange: ', paginationRange);

  return (
    <ul className={clsx('pagination-container', { [className]: className })}>
      <li
        className={clsx('pagination-item', {
          disabled: currentPage === 1,
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      {paginationRange.map((pageNumber: number | string, indx: number) => {
        if (pageNumber === DOTS) {
          return (
            <li
              key={`pagination-dots-${indx}`}
              className="pagination-item dots"
            >
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={`pagination-item-${indx}`}
            className={clsx('pagination-item', {
              selected: pageNumber === currentPage,
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={clsx('pagination-item', {
          disabled: currentPage === lastPage,
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>
  );
};

export default TFPagination;
