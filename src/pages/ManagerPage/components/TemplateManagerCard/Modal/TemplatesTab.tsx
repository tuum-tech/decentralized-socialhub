import React, { useState, useEffect } from 'react';
import { IonSearchbar } from '@ionic/react';
import styled from 'styled-components';

import { SearchComponent } from 'src/elements/inputs/SearchInput';
import { showNotify } from 'src/utils/notify';
import { DefaultButton } from 'src/elements-v2/buttons';

import cryptoImg from '../../../../../assets/templates/crypto.png';
import educationImg from '../../../../../assets/templates/education.png';
import gamerImg from '../../../../../assets/templates/gamer.png';
import soccerImg from '../../../../../assets/templates/soccer.png';

export const getTemplateImg = (t: string) => {
  if (t === 'crypto') {
    return cryptoImg;
  }
  if (t === 'education') {
    return educationImg;
  }
  if (t === 'gamer') {
    return gamerImg;
  }
  return soccerImg;
};

export const Content = styled.div`
  padding: 0px;
  display: inline-grid;
  grid-template-columns: 50% 50%;
`;

export const TemplateCard = styled.div`
  background: #ffffff;
  margin: 8px;

  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;

  display: flex;
  padding: 30px 20px;
  align-items: center;
  justify-content: space-between;

  .left {
    .title {
      font-weight: bold;
      font-size: 18px;
      line-height: 21px;
      display: flex;
      align-items: center;
      letter-spacing: -0.005em;
      color: #101225;
      margin-bottom: 3px;
    }

    .text {
      font-weight: normal;
      font-size: 14px;
      line-height: 23px;
      font-feature-settings: 'salt' on;
      color: #425466;
      margin-bottom: 11px;
    }
  }
  .right {
    img {
      display: block;
    }
  }
`;

interface Props {
  myTemplates: string[];
  allTemplates: Template[];
  updateTemplates: (newMyTemplates: string[]) => void;
  activeTemplate: string;
}

const TemplatesTab = ({
  myTemplates,
  updateTemplates,
  activeTemplate,
  allTemplates
}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState(allTemplates);

  useEffect(() => {
    (async () => {
      if (searchQuery !== '' && searchQuery.length > 2) {
        setFilteredTemplates(
          allTemplates.filter((t: any) => t.value.includes(searchQuery))
        );
      } else if (searchQuery === '') {
        setFilteredTemplates(allTemplates);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleClick = (t: Template) => {
    if (t.value === activeTemplate) {
      showNotify(
        'This is an active template. Please update your template first and remove',
        'warning'
      );
    } else {
      let newTemplates = [];
      if (myTemplates.includes(t.value)) {
        // remove
        newTemplates = myTemplates.filter(value => value !== t.value);
      } else {
        // add
        newTemplates = myTemplates.concat([t.value]);
      }
      updateTemplates(newTemplates);
    }
  };

  return (
    <div>
      <SearchComponent>
        <IonSearchbar
          value={searchQuery}
          onIonChange={e => setSearchQuery(e.detail.value!)}
          placeholder="Search people, pages by name or DID"
        ></IonSearchbar>
      </SearchComponent>
      <Content>
        {filteredTemplates.map((t: Template) => (
          <TemplateCard key={t.value}>
            <div className="left">
              <p className="title">{t.title}</p>
              <p className="text">{t.intro}</p>
              <DefaultButton
                size="small"
                style={{ minWidth: 100 }}
                variant="outlined"
                btnColor="primary-gradient"
                textType="gradient"
                onClick={() => handleClick(t)}
              >
                {myTemplates.includes(t.value) ? '-Remove' : '+Add'}
              </DefaultButton>
            </div>
            <div className="right">
              <img src={getTemplateImg(t.value)} alt={t.value} />
            </div>
          </TemplateCard>
        ))}
      </Content>
    </div>
  );
};

export default TemplatesTab;
