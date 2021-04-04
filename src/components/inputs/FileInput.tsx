import React from 'react';

import { IonLabel } from '@ionic/react';
import style from './FileInput.module.scss';

interface Props {
  label?: string;
  value?: string;
  flexDirection?: string;
  hasError?: boolean;
  onChange: (e: string) => void;
  className?: string;
}

const FileInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  flexDirection = 'row',
  hasError = false,
  className
}) => {
  let cName = style['fileinput'];
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
        <IonLabel className={style['fileinput_label']}>{label}</IonLabel>
      )}
      <input className={style['fileinput_field']} type="file" accept="*/*" />
    </div>
  );
};

export default FileInput;
