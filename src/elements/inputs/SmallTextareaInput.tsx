import React from 'react';

import { IonTextarea, IonLabel } from '@ionic/react';
import style from './SmallTextareaInput.module.scss';

interface Props {
  placeholder?: string;
  label?: string;
  cols?: number;
  rows?: number;
  value?: string;
  flexDirection?: string;
  hasError?: boolean;
  readonly?: boolean;
  onChange: (e: string) => void;
  className?: string;
}

const SmallTextareaInput: React.FC<Props> = ({
  placeholder,
  label,
  cols,
  rows,
  value,
  onChange,
  flexDirection = 'row',
  hasError = false,
  readonly = false,
  className
}) => {
  let cName = style['textareainput'];
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
        <IonLabel className={style['textareainput_label']}>{label}</IonLabel>
      )}
      <IonTextarea
        cols={cols}
        rows={rows}
        value={value}
        className={style['textareainput_field']}
        placeholder={placeholder}
        readonly={readonly}
        onIonChange={e => onChange(e.detail.value!)}
      ></IonTextarea>
    </div>
  );
};

export default SmallTextareaInput;
