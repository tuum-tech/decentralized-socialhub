import React, { useState } from 'react';
import { IonCardTitle, IonCol, IonRow, IonButton } from '@ionic/react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { MyGrid } from 'src/components/cards/common';
import style from './PostEditor.module.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface Props {
  onCreate: (content: any) => void;
  onClose: () => void;
}

const PostEditor: React.FC<Props> = ({ onCreate, onClose }: Props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState);
  };
  const handleCreate = () => {
    const contentState = editorState.getCurrentContent();
    const content = '';
    console.log(contentState);
    onCreate(content);
  };
  return (
    <MyGrid className={style['form']}>
      <IonRow className={style['form_title']}>
        <IonCardTitle>Create a new post</IonCardTitle>
      </IonRow>
      <IonRow className="ion-justify-content-center">
        <Editor
          editorState={editorState}
          wrapperClassName="wrapper"
          editorClassName="editor"
          onEditorStateChange={onEditorStateChange}
        />
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
