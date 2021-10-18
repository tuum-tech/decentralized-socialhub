import React from 'react';

import { showNotify } from 'src/utils/notify';

import { getTemplateImg, Content, TemplateCard } from './TemplatesTab';

interface Props {
  myTemplates: string[];
  updateTemplates: (newMyTemplates: string[]) => void;
  activeTemplate: string;
  allTemplates: Template[];
}

const ManageTab = ({
  myTemplates,
  updateTemplates,
  activeTemplate,
  allTemplates
}: Props) => {
  const templates = allTemplates.filter((v: Template) =>
    myTemplates.includes(v.value)
  );
  return (
    <Content>
      {templates.map((t: Template) => (
        <TemplateCard key={t.value}>
          <div className="left">
            <p className="title">{t.title}</p>
            <p className="text">{t.intro}</p>
            <button
              onClick={() => {
                if (t.value === activeTemplate) {
                  showNotify(
                    'This is an active template. Please update your template first and remove',
                    'warning'
                  );
                } else {
                  const newTemplates = myTemplates.filter(
                    value => value !== t.value
                  );
                  updateTemplates(newTemplates);
                }
              }}
            >
              +Remove
            </button>
          </div>
          <div className="right">
            <img src={getTemplateImg(t.value)} alt={t.value} />
          </div>
        </TemplateCard>
      ))}
    </Content>
  );
};

export default ManageTab;
