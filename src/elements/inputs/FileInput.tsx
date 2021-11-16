import React, { useRef } from 'react';
import { IonLabel } from '@ionic/react';

import Attachment from 'src/assets/icon/attachment.svg';
import style from './FileInput.module.scss';

interface Props {
  label?: string;
  value?: string;
  flexDirection?: string;
  hasError?: boolean;
  onChange: (e: File) => void;
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
  const fileInput = useRef(null);
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
      <input
        ref={fileInput}
        hidden
        className={style['fileinput_field']}
        onChange={e => {
          onChange(e.target.files![0]);
        }}
        type="file"
        accept="*/*"
      />
      <div
        className={style.fileinput_input}
        onClick={() => {
          // @ts-ignore
          fileInput?.current?.click();
        }}
      >
        <img src={Attachment} alt="attachment" />
        Attach a file
      </div>
    </div>
  );
};

export default FileInput;
