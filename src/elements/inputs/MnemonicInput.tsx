import React from 'react';

import { IonInput, IonLabel } from '@ionic/react';
import style from './MnemonicInput.module.scss';

interface Props {
  placeholder?: string;
  label?: string;
  value?: string;
  flexDirection?: string;
  hasError?: boolean;
  readonly?: boolean;
  onInput: (k: any) => void;
  onRef: (e: any) => void;
  className?: string;
}

const MnemonicInput: React.FC<Props> = ({
  placeholder,
  label,
  value,
  onInput,
  onRef,
  flexDirection = 'row',
  hasError = false,
  readonly = false,
  className
}) => {
  let cName = style['textinput'];
  if (flexDirection === 'column') {
    cName += ` ${style['flex-row']}`;
  }
  if (hasError) {
    cName += ` ${style['hasError']}`;
  }
  if (className) {
    cName += ` ${className}`;
  }

  return (
    <div className={cName}>
      {label && label !== '' && (
        <IonLabel className={style['textinput_label']}>{label}</IonLabel>
      )}
      <IonInput
        ref={element => onRef(element)}
        type="text"
        value={value}
        className={style['textinput_field']}
        placeholder={placeholder}
        readonly={readonly}
        onKeyUp={e => onInput(e)}
      />
    </div>
  );
};

export default MnemonicInput;
