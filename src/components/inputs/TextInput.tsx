/**
 * Page
 */

import React from 'react';

import { IonInput, IonLabel } from '@ionic/react';
import style from './TextInput.module.scss';

interface Props {
  placeholder?: string;
  label?: string;
  value?: string;
  flexDirection?: string;
  hasError?: boolean;
  onChange: (e: string) => void;
  type?:
    | 'number'
    | 'text'
    | 'time'
    | 'date'
    | 'email'
    | 'password'
    | 'search'
    | 'tel'
    | 'url'
    | undefined;
}

const TextInput: React.FC<Props> = ({
  placeholder,
  label,
  value,
  onChange,
  flexDirection = 'row',
  hasError = false,
  type = 'text',
}) => {
  let cName = style['textinput'];
  if (flexDirection === 'column') {
    cName += ` ${style['flex-row']}`;
  }
  if (hasError) {
    cName += ' hasError';
  }

  return (
    <div className={cName}>
      {label && label !== '' && (
        <IonLabel className={style['textinput_label']}>{label}</IonLabel>
      )}
      <IonInput
        type={type}
        value={value}
        className={style['textinput_field']}
        placeholder={placeholder}
        onIonChange={(e) => onChange(e.detail.value!)}
      />
    </div>
  );
};

export default TextInput;
