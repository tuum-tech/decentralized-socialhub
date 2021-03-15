import React from 'react';
import styled from 'styled-components';

const ConnectDivider = styled.div`
  width: 100%;
  position: relative;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DividerLine = styled.hr`
  background-color: #edf2f7;
  width: 100%;
  height: 1px;
  margin: 0;
`;

const DividerText = styled.div`
  font-size: 10px;
  line-height: 12px;
  color: #7a7a9d;
  position: absolute;
  padding-left: 24px;
  padding-right: 24px;
  background-color: #fbfbfd;
`;

interface Props {
  text?: string;
  mt?: number;
}

const FieldDivider: React.FC<Props> = ({ text, mt }) => {
  return (
    <ConnectDivider style={{ marginTop: mt ? `${mt}px` : '30px' }}>
      <DividerLine />
      <DividerText>{text || 'or'} </DividerText>
    </ConnectDivider>
  );
};

export default FieldDivider;
