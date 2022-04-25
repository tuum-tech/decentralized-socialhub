import React, { useEffect, useState } from 'react';
import { IonRow, IonCol } from '@ionic/react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Follower from '../common/Follower';
import Members from '../common/Members';
import Links from '../common/Links';
import { Wrapper } from '../common';
import Post from './Post';

interface IProps {
  space: any;
}

const Home: React.FC<IProps> = ({ space }: IProps) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState: any) => {
    console.log(editorState);
    setEditorState(editorState);
  };
  return (
    <Wrapper>
      <IonRow></IonRow>
      <IonRow>
        <IonCol size="8">
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={onEditorStateChange}
          />
          <Post />
        </IonCol>
        <IonCol size="4">
          {space.socialLinks && Object.keys(space.socialLinks).length > 0 && (
            <Links space={space} />
          )}
          <Members space={space} />
          {space.followers &&
            space.followers.length > 0 &&
            space.publicFields.includes('follower') && (
              <Follower space={space} />
            )}
        </IonCol>
      </IonRow>
    </Wrapper>
  );
};

export default Home;
