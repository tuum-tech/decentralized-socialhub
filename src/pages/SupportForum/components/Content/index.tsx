import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { IonSearchbar } from '@ionic/react';
import styled from 'styled-components';

import SelectInput from 'src/elements/inputs/SelectInput';

const Category = styled.div<{ color?: string }>`
  background: rgba(76, 111, 255, 0.1);
  border-radius: 8px;
  padding: 3px 10px;
  text-align: center;
  width: 60px;
  margin: 0 auto;

  ${props => {
    return `color: ${props.color ? props.color : '4c6fff'};`;
  }}
`;

const Containr = styled.div`
  padding: 25px 12.5%;
  position: relative;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  .search-input {
    width: 50%;
    height: 100%;
    border: none;
    --box-shadow: none;
    padding: 0;
    border-radius: 9px;
    --placeholder-font-style: 'SF Pro Display';
    font-family: 'SF Pro Display';
    font-size: 15px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: normal;
    text-align: left;
    color: #16192c;
    --placeholder-color: #b5b5bd;

    input {
      box-shadow: none;
      background: #edf2f7;
      border: 1px solid #edf2f7;
      border-radius: 9px;

      &:focus {
        background: #fff;
        border: 1px solid #ececec;
      }
    }

    .active {
      color: #16192c;
    }
  }
`;

const SelectComp = styled.div`
  display: flex;
  align-items: center;

  p {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 23px;

    color: #7a7a9d;
    margin-right: 10px;
  }

  div:nth-of-type(1) {
    margin-top: 0px !important;

    ion-select {
      width: 200px;
      margin: 0 !important;
      height: 44px !important;
    }
  }
`;

const TableContent = styled.div`
  width: 100%;

  .topic {
    width: calc(100% - 300px);
  }
  .category {
    width: 100px;
    text-align: center;
  }
  .votes {
    width: 100px;
    text-align: center;
  }
  .date {
    width: 100px;
    text-align: right;
  }

  .table-head {
    margin-top: 20px;
    background: #fafafb;
    box-shadow: inset 0px -1px 0px #edf2f7;
    padding: 9px 21px;
    display: flex;
    align-items: center;

    div {
      font-style: normal;
      font-weight: 600;
      font-size: 10px;
      line-height: 16px;

      letter-spacing: 0.06em;
      text-transform: uppercase;

      color: #8492a6;
    }
  }

  .table-row {
    display: flex;
    align-items: center;
    margin: 25px 21px;

    a {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 162.02%;
      font-feature-settings: 'salt' on;

      color: #4c6fff;
    }
  }
`;

const Content: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const search = (e: any) => {
    setSearchQuery(e.detail.value!);
  };

  return (
    <Containr>
      <Header>
        <IonSearchbar
          value={searchQuery}
          onIonChange={e => search(e)}
          placeholder="Search Issues, feedbacks & bugs"
          className="search-input"
        />
        <SelectComp>
          <p>Filter by</p>
          <SelectInput
            values={[
              { value: 1, text: 'Suggestion' },
              { value: 2, text: 'Bug' }
            ]}
            onChange={e => {}}
            placeholder="Suggestion"
          />
        </SelectComp>
      </Header>

      <TableContent>
        <div className="table-head">
          <div className="topic">Topic</div>
          <div className="category">Category</div>
          <div className="votes">Votes</div>
          <div className="date">DATE</div>
        </div>
        <div className="table-row">
          <div className="topic">
            <Link to="/">
              Dashboard: The "Ready" text is not in the correct place
            </Link>
          </div>
          <div className="category">
            <Category>Bug</Category>
          </div>
          <div className="votes">994 Votes</div>
          <div className="date">11 days ago</div>
        </div>
      </TableContent>
    </Containr>
  );
};

export default Content;
