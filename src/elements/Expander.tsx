import React, { useState } from 'react';
import styled from 'styled-components';
import { IonGrid } from '@ionic/react';

const Container = styled.div`
  border: 1px solid #cbd5e0;
  box-sizing: border-box;
  border-radius: 8px;

  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #425466;

  margin-top: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
`;

const GridContent = styled(IonGrid)`
  display: grid;
  grid-template-columns: 50% 50%;

  .content {
    padding: 20px;
  }
`;

interface Props {
  title: string;
  cateogiries: {
    field: string;
    value: string;
  }[];
}

const Expander = ({ title, cateogiries }: Props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Container>
      <Header
        style={{
          borderBottom: expanded ? '1px solid #cbd5e0' : 'none'
        }}
      >
        <div onClick={() => setExpanded(!expanded)}>
          {expanded ? '-' : '+'}
          {title}
        </div>
        <div>
          {cateogiries.length} record{cateogiries.length > 1 ? 's' : ''}{' '}
        </div>
      </Header>
      {expanded && (
        <GridContent>
          {cateogiries.map(c => (
            <div key={c.field + c.value} className="content">
              {c.field}: {c.value}
            </div>
          ))}
        </GridContent>
      )}
    </Container>
  );
};

export default Expander;
