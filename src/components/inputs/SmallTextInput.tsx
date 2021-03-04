/**
 * Page
 */

import React from 'react';

import { IonInput, IonLabel } from '@ionic/react';
import style from './SmallTextInput.module.scss';

interface Props {
  placeholder?: string;
  label?: string;
  value?: string;
  name?: string;
  flexDirection?: string;
  hasError?: boolean;
  onChange: (e: any) => void;
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

const SmallTextInput: React.FC<Props> = ({
  placeholder,
  label,
  name,
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
        name={name}
        className={style['textinput_field']}
        placeholder={placeholder}
        onIonChange={(e) => onChange(e)}
      />
    </div>
  );
};

export default SmallTextInput;
