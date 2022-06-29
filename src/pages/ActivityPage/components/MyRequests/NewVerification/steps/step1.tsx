import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';

import DropDown from 'src/elements/svg/DropDown';
import DropUp from 'src/elements/svg/DropUp';
import CheckFill from 'src/assets/icon/check-circle-fill.svg';
import CheckEmpty from 'src/assets/icon/check-circle.svg';
import { DefaultButton } from 'src/elements-v2/buttons';

import style from './../style.module.scss';

export const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  height: 600px;

  ${down('sm')} {
    height: auto;
  }

  .content {
    margin-top: 50px;
  }

  & > button {
    margin-top: 20px;
  }

  p.title {
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
    color: #27272e;
    margin-bottom: 12px;
  }
  .intro {
    font-size: 16px;
    line-height: 162.02%;
    font-feature-settings: 'salt' on;
    color: #27272e;
  }
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
  const selectedCategories = credentials.map(c => c.idKey);
  const [selectedItem, setSelectedItem] = useState(
    selectedCredential === '' || selectedCredential === undefined
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

    setCredentials([selectedItem as VerificationData]);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedItem, setCredentials, wrapperRef]);

  return (
    <Container>
      <div className="content">
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
                  if (selectedCategories.includes(cate.idKey)) {
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
                    selectedCategories.includes(cate.idKey)
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

      <DefaultButton
        variant="contained"
        btnColor="primary-gradient"
        size="large"
        disabled={selectedCategories.length === 0}
        style={{
          cursor: selectedCategories.length === 0 ? 'not-allowed' : 'pointer',
          width: 212
        }}
        onClick={onNext}
      >
        Continue
      </DefaultButton>
    </Container>
  );
};

export default CredentialView;
