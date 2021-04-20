import React, { useEffect, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol
} from '@ionic/react';
import ReactPaginate from 'react-paginate';

import DidCard from './DidCard';
import style from './PagesCard.module.scss';
import universityImg from '../../assets/university.png';
interface IProps {
  pages?: PageDTO;
  searchKeyword?: string;
  isSearchKeywordDID?: boolean;
  size?: string;
}

const pageItem = (pageItem: any, indexItem: number, colSize: any) => {
  return (
    <DidCard
      name={pageItem.name}
      did={pageItem.did}
      avatar={pageItem.avatar || universityImg}
      colSize={colSize}
      type="page"
      key={'did-page-card-' + indexItem}
    />
  );
};

const PagesCard: React.FC<IProps> = ({
  pages,
  searchKeyword,
  isSearchKeywordDID,
  size = '12'
}: IProps) => {
  const perPage = parseInt(size) / 12 === 1 ? 4 : 8;
  const totalPages = pages && pages.items ? pages.items.length / perPage : 1;

  const [pagesPageOffset, setPagesPageOffset] = useState(0);
  const [listPages, setListPages] = useState<any[]>([]); //useState([]);

  useEffect(() => {
    let listPagesLocal: any =
      pages &&
      pages.items
        .slice(pagesPageOffset, pagesPageOffset + perPage)
        .map((p, index) =>
          pageItem(p, index, parseInt(size) / 12 === 1 ? '100%' : '50%')
        );

    setListPages(listPagesLocal);
  }, [pagesPageOffset, pages]);

  const handlePagesPageClick = (data: any) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    setPagesPageOffset(offset);
  };

  return (
    <IonCol
      size={(parseInt(size) / 12 === 1 ? parseInt(size) / 2 : 12).toString()}
      className={style['pages']}
    >
      <IonCard className={style['tab-card']}>
        <IonCardHeader>
          <IonCardTitle className={style['card-title']}>Pages</IonCardTitle>
        </IonCardHeader>
        {listPages}
        {listPages && (
          <ReactPaginate
            previousLabel={'◀︎'}
            nextLabel={'▶︎'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePagesPageClick}
            containerClassName={style['pagination']}
            //  subContainerClassName={'pages pagination'}
            activeClassName={style['page-active']}
          />
        )}
        {!listPages && (
          <IonCardContent>
            No page found with the {isSearchKeywordDID ? 'DID' : 'keyword'}:{' '}
            <strong>{searchKeyword}</strong>
          </IonCardContent>
        )}
      </IonCard>
    </IonCol>
  );
};

export default PagesCard;
