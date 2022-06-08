import React, { useState } from 'react';
import { IonCardTitle, IonCol, IonRow, IonButton } from '@ionic/react';
import SmallTextareaInput from 'src/elements/inputs/SmallTextareaInput';
import { MyGrid } from 'src/components/cards/common';
import style from './editor.module.scss';

interface Props {
  onCreate: (content: any) => void;
  onClose: () => void;
}

const PostEditor: React.FC<Props> = ({ onCreate, onClose }: Props) => {
  const [content, setContent] = useState<string>('');
  const handleCreate = () => {
    onCreate(content);
  };
  return (
    <MyGrid className={style['form']}>
      <IonRow className={style['form_title']}>
        <IonCardTitle>Create a new post</IonCardTitle>
      </IonRow>
      <IonRow className="ion-justify-content-center">
        {/* <Editor
          editorState={editorState}
          wrapperClassName="wrapper"
          editorClassName="editor"
          onEditorStateChange={onEditorStateChange}
        /> */}
        <SmallTextareaInput
          label=""
          rows={9}
          value={content}
          onChange={val => setContent(val)}
          placeholder=""
        ></SmallTextareaInput>
      </IonRow>
      <IonRow className={style['form_footer']}>
        <IonCol size="12">
          <IonButton shape="round" fill="outline" onClick={onClose}>
            Cancel
          </IonButton>
          <IonButton shape="round" onClick={handleCreate}>
            Create
          </IonButton>
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default PostEditor;
