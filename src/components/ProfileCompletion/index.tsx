import React from 'react';
import style from './style.module.scss';

import TodoList from '../TodoList';

const ProfileCompletion: React.FC = () => {
  return (
    <div className={style["profilecompletion"]}>
      {/*-- Default ProfileCompletion --*/}
      <TodoList
        title="Profile Completion"
        targetList={['Complete your profile', 'Publish your profile', 'Add Profile Photo', 'Add 1 Educational Record', 'Add Summary', 'Verify Diploma']}
        accomplishedList={['Complete your profile', 'Publish your profile']}
      />
    </div >
  )
};

export default ProfileCompletion;
