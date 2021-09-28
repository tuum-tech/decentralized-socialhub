import React, { useState } from 'react';
import styled from 'styled-components';
import { IonModal } from '@ionic/react';

import TemplateTabs from './Tabs';
import TemplatesTab from './TemplatesTab';
import ManageTab from './ManageTab';

export const Container = styled.div`
  position: relative;
  padding: 20px 22px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const TemplateModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 670px;
  --height: 578px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

interface Props {
  activeTemplate: string;
  myTemplates: string[];
  allTemplates: Template[];
  updateTemplates: (templates: string[]) => void;
}

const TemplateModalContent = ({
  activeTemplate,
  myTemplates,
  updateTemplates,
  allTemplates
}: Props) => {
  const [tab, setTab] = useState('templates');

  return (
    <div>
      <TemplateTabs tab={tab} setTab={setTab} />
      <Container>
        {tab === 'templates' ? (
          <TemplatesTab
            activeTemplate={activeTemplate}
            myTemplates={myTemplates}
            updateTemplates={updateTemplates}
            allTemplates={allTemplates}
          />
        ) : (
          <ManageTab
            activeTemplate={activeTemplate}
            myTemplates={myTemplates}
            updateTemplates={updateTemplates}
            allTemplates={allTemplates}
          />
        )}
      </Container>
    </div>
  );
};

export default TemplateModalContent;
