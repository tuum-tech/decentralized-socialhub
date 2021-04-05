import React from 'react';

import { IonSelect, IonSelectOption, IonLabel } from '@ionic/react';
import style from './SelectInput.module.scss';

interface Props {
  placeholder?: string;
  label?: string;
  values?: {
    value: number;
    text: string;
  }[];
  flexDirection?: string;
  hasError?: boolean;
  onChange: (e: string) => void;
  className?: string;
}

const SelectInput: React.FC<Props> = ({
  placeholder,
  label,
  values,
  onChange,
  flexDirection = 'row',
  hasError = false,
  className
}) => {
  let cName = style['selectinput'];
  if (flexDirection === 'column') {
    cName += ` ${style['flex-row']}`;
  }
  if (hasError) {
    cName += ` ${style['hasError']}`;
  }
  if (className) {
    cName += ` ${className}`;
  }
  let options = values ? values : [];
  return (
    <div className={cName}>
      {label && label !== '' && (
        <IonLabel className={style['selectinput_label']}>{label}</IonLabel>
      )}
      <IonSelect
        className={style['selectinput_field']}
        placeholder={placeholder}
        onIonChange={e => onChange(e.detail.value!)}
      >
        {options.map(function(item, index) {
          return (
            <IonSelectOption value={item.value}>{item.text}</IonSelectOption>
          );
        })}
      </IonSelect>
    </div>
  );
};

export default SelectInput;
