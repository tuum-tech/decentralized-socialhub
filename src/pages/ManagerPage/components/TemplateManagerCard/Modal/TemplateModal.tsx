import React, { useState } from 'react';
import styled from 'styled-components';

import TemplateTabs from './Tabs';
import TemplatesTab from './TemplatesTab';
import ManageTab from './ManageTab';

export const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
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
