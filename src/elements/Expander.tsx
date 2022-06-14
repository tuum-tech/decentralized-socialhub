import React, { useState } from 'react';
import styled from 'styled-components';
import { IonGrid } from '@ionic/react';

import DropDown from 'src/elements/svg/DropDown';
import DropUp from 'src/elements/svg/DropUp';
import { CountLabel } from 'src/elements/note';

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
  padding: 12px 20px;
  font-size: 14px;
  font-weight: bold;
  .d-flex {
    display: flex;
    align-items: center;
  }
`;

const GridContent = styled(IonGrid)`
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 10px 20px;
  .content {
    padding: 10px;
    h4 {
      font-size: 13px;
      font-weight: normal;
      line-height: 162.02%;
      color: #a0aec0;
      margin: 0px;
    }
    p {
      font-size: 16px;
      font-weight: normal;
      line-height: 162.02%;
      color: #27272e;
      margin: 0px;
    }
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
        onClick={() => setExpanded(!expanded)}
      >
        <div className={'d-flex'}>
          {title}
          <CountLabel>{cateogiries.length}</CountLabel>
        </div>
        <div>
          {expanded ? (
            <DropUp fill={'#130f26'} />
          ) : (
            <DropDown fill={'#130f26'} />
          )}
        </div>
      </Header>
      {expanded && (
        <GridContent>
          {cateogiries.map(c => (
            <div key={c.field + c.value} className="content">
              <h4>
                {c.field.toLowerCase().replace(/^\w|\s\w/g, function(letter) {
                  return letter.toUpperCase();
                })}
              </h4>
              <p>{c.value}</p>
            </div>
          ))}
        </GridContent>
      )}
    </Container>
  );
};

export default Expander;
