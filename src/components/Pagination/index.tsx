import React from 'react';
import { IonRow } from '@ionic/react';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';

import {
  ITEMS_PER_PAGE_DEFAULT,
  ITEMS_PER_PAGE_SPACES
} from 'src/pages/ExplorePage/constants';

import style from './Pagination.module.scss';

interface PaginationProps {
  perPage: number;
  lists: any[];
  totalPages: number;
  onPageCountChange: (selected: any) => void;
  onPageChange: (data: any) => void;
  isVisiblePageCount?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  perPage,
  lists,
  totalPages,
  onPageChange,
  onPageCountChange,
  isVisiblePageCount = true
}: PaginationProps) => {
  let itemsPerPage =
    perPage === 9 ? ITEMS_PER_PAGE_SPACES : ITEMS_PER_PAGE_DEFAULT;
  return (
    <IonRow className={style['pagination-footer']}>
      <div>
        Showing {perPage > lists.length ? lists.length : perPage} item out of{' '}
        {lists.length}
      </div>
      <ReactPaginate
        previousLabel={'◀︎'}
        nextLabel={'▶︎'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={onPageChange}
        containerClassName={style['pagination']}
        activeClassName={style['page-active']}
      />
      {isVisiblePageCount && (
        <div className={style['page-count-select']}>
          <div className={style['rows-per-page-text']}>Rows per page</div>
          <Select
            className="items-per-page"
            classNamePrefix="select"
            name="pagecount"
            options={itemsPerPage}
            defaultValue={itemsPerPage[0]}
            onChange={onPageCountChange}
            components={{ IndicatorSeparator: null }}
            menuPosition="fixed"
          />
        </div>
      )}
    </IonRow>
  );
};

export default Pagination;
