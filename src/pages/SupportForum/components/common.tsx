import styled from 'styled-components';

import { GithubIssueLabel } from '../constants';

interface Props {
  label?: string;
}

export const Category = styled.div<Props>`
  border-radius: 8px;
  padding: 3px 10px;
  text-align: center;
  margin-left: 5px;
  ${(props: any) => {
    const label = props.label;
    if (!label) return `color: #4c6fff;`;
    return `color: ${
      (GithubIssueLabel as any)[label.replace(' ', '_')].style.color
    };`;
  }}
  ${(props: any) => {
    const label = props.label;
    if (!label) return `background: rgba(76, 111, 255, 0.1);`;
    return `background: ${
      (GithubIssueLabel as any)[label.replace(' ', '_')].style.backgroundColor
    };`;
  }}
`;

export const TableContent = styled.div`
  width: 100%;

  .topic {
    width: calc((100% - 200px) * 0.8);
  }
  .category {
    display: flex;
    align-items: center;
    justify-content: start;
    width: calc((100% - 200px) * 0.2);
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
