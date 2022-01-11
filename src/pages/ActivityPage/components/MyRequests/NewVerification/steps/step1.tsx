import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import DropDown from 'src/elements/svg/DropDown';
import DropUp from 'src/elements/svg/DropUp';
import CheckFill from 'src/assets/icon/check-circle-fill.svg';
import CheckEmpty from 'src/assets/icon/check-circle.svg';

import style from '../../../../../Auth/components/MultiDidPasswordLogin/style.module.scss';

export const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  height: 600px;

  .title {
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
    color: #27272e;
  }
  .intro {
    font-size: 16px;
    line-height: 162.02%;
    font-feature-settings: 'salt' on;
    color: #27272e;
  }
`;

export const NextButton = styled.button`
  padding: 0px 20px;

  width: 296px;
  height: 36px;
  line-height: 36px;
  left: 0px;
  bottom: 20px;

  color: white;
  background: #4c6fff;
  border-radius: 6px;
`;
interface Props {
  credentials: VerificationData[];
  selectedCredential?: string;
  categories: VerificationData[];
  setCredentials: (newCredentials: VerificationData[]) => void;
  onNext: () => void;
}

const CredentialView = ({
  credentials,
  selectedCredential,
  categories,
  setCredentials,
  onNext
}: Props) => {
  const selectedCategoreis = credentials.map(c => c.idKey);
  const [selectedItem, setSelectedItem] = useState(
    selectedCredential === ''
      ? categories[0]
      : categories.find(x => x.idKey === selectedCredential)
  );
  const [showItems, setShowItems] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        wrapperRef &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setShowItems(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <Container>
      <div>
        <p className="title">Choose Credentials</p>
        <p>Please select one record per request</p>

        <div className={style['selectBox-box']} ref={wrapperRef}>
          <div
            className={style['selectBox-container']}
            style={{
              borderBottomLeftRadius: showItems ? '0' : '6px',
              borderBottomRightRadius: showItems ? '0' : '6px'
            }}
          >
            <div
              className={style['selectBox-selected-item']}
              onClick={() => setShowItems(!showItems)}
            >
              <div>{selectedItem?.idKey}</div>
              <div className={style['selectBox-arrow']}>
                {showItems ? <DropUp /> : <DropDown />}
              </div>
            </div>
          </div>

          <div
            style={{ display: showItems ? 'block' : 'none' }}
            className={style['selectBox-items']}
          >
            {categories.map((cate: VerificationData) => (
              <div
                key={cate.idKey}
                onClick={() => {
                  if (selectedCategoreis.includes(cate.idKey)) {
                    setCredentials(
                      credentials.filter(c => c.idKey !== cate.idKey)
                    );
                  } else {
                    setCredentials(credentials.concat([cate]));
                  }
                  setSelectedItem(cate);
                }}
                className={style['selectBox-items_row']}
                style={{
                  justifyContent: 'space-between'
                }}
              >
                <div>{cate.idKey}</div>
                <img
                  src={
                    selectedCategoreis.includes(cate.idKey)
                      ? CheckFill
                      : CheckEmpty
                  }
                  alt="check"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <NextButton
        disabled={selectedCategoreis.length === 0}
        style={{
          cursor: selectedCategoreis.length === 0 ? 'not-allowed' : 'pointer'
        }}
        onClick={onNext}
      >
        Next
      </NextButton>
    </Container>
  );
};

export default CredentialView;
