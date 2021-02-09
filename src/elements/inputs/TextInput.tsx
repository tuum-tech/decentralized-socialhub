/**
 * Page
 */

import React from 'react';

import { IonItem, IonInput, IonLabel, IonRow } from '@ionic/react';
import style from './TextInput.module.scss';

interface Props {
  placeholder?: string;
  label?: string;
  value?: string;
  onChange: (e: string) => void;
}

const TextInput: React.FC<Props> = ({
  placeholder,
  label,
  value,
  onChange,
}) => {
  return (
    <div className={style['textinput']}>
      <IonLabel className={style['textinput_label']}>{label}</IonLabel>
      <IonInput
        value={value}
        className={style['textinput_field']}
        placeholder={placeholder}
        onIonChange={(e) => onChange(e.detail.value!)}
      />
    </div>
  );
};

export default TextInput;
