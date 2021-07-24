import styled from 'styled-components';

interface Props {
  color?: string;
}

export const Category = styled.div<Props>`
  background: rgba(76, 111, 255, 0.1);
  border-radius: 8px;
  padding: 3px 10px;
  text-align: center;
  width: 60px;
  margin: 0 auto;

  ${props => {
    return `color: ${props.color ? props.color : '#4c6fff'};`;
  }}
`;

export const TableContent = styled.div`
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
