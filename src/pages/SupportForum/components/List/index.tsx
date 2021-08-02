import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IonSearchbar } from '@ionic/react';
import styled from 'styled-components';

import SelectInput from 'src/elements/inputs/SelectInput';
import { timeSince } from 'src/utils/time';

import { TableContent, Category } from '../common';
import { GithubIssueLabel } from '../../constants';

interface ListProp {
  githubIssues: any[];
}

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

const Intro = styled.div`
  background: #17171b;
  padding: 65px 12.5%;

  h1 {
    font-style: normal;
    font-weight: bold;
    font-size: 36px;
    line-height: 136.02%;
    color: #ffffff;
  }

  p {
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 35px;

    letter-spacing: 0.02em;

    color: #cbd5e0;
  }
`;

const List: React.FC<ListProp> = ({ githubIssues }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [labels, setLabels] = useState<any[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<any[]>([]);
  const search = (e: any) => {
    setSearchQuery(e.detail.value!);
  };

  useEffect(() => {
    let filteredIssues = [...githubIssues];

    if (searchQuery) {
      filteredIssues = filteredIssues.filter(issue =>
        issue.title.toUpperCase().includes(searchQuery.toUpperCase())
      );
    }
    if (labels) {
      filteredIssues = filteredIssues.filter(issue => {
        const lblNames = issue.labels.map((label: any) => label.name);
        return lblNames
          .sort()
          .join()
          .includes(labels.sort().join());
      });
    }
    setFilteredIssues(filteredIssues);
  }, [searchQuery, githubIssues, labels]);

  return (
    <>
      <Intro>
        <h1>Feedbacks, Issues & New Features</h1>
        <p>
          Get the lastest on what profile team is working on and catchup product
          related bugs
        </p>
      </Intro>
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
              values={Object.keys(GithubIssueLabel).map(key => {
                const lblName = (GithubIssueLabel as any)[key].name;
                return { value: lblName, text: lblName };
              })}
              onChange={e => {
                setLabels(e);
              }}
              multiple={true}
              placeholder="All"
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

          {filteredIssues.map((issue, index) => {
            const linkUrl = '/support-forum/' + issue.number;
            return (
              <div className="table-row" key={index}>
                <div className="topic">
                  <Link to={linkUrl}>{issue.title}</Link>
                </div>
                <div className="category">
                  {issue.labels.map((label: any) => {
                    return <Category label={label.name}>{label.name}</Category>;
                  })}
                </div>
                <div className="votes">589 Votes</div>
                <div className="date">
                  {timeSince(new Date(issue.updated_at).getTime())}
                </div>
              </div>
            );
          })}
        </TableContent>
      </Containr>
    </>
  );
};

export default List;
