import React, { useEffect, useState } from 'react';

import { IonSelect, IonSelectOption, IonLabel } from '@ionic/react';
import style from './SmallSelectInput.module.scss';

interface Props {
  placeholder?: string;
  label?: string;
  values?: {
    value: number | string | boolean;
    text: string;
  }[];
  defaultValue?: string | number | boolean;
  flexDirection?: string;
  hasError?: boolean;
  multiple?: boolean;
  onChange: (e: any) => void;
  className?: string;
}

const SmallSelectInput: React.FC<Props> = ({
  placeholder,
  label,
  values,
  defaultValue,
  onChange,
  flexDirection = 'row',
  hasError = false,
  multiple = false,
  className
}) => {
  const [value, setValue] = useState<any>('');
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
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue])
  return (
    <div className={cName}>
      {label && label !== '' && (
        <IonLabel className={style['selectinput_label']}>{label}</IonLabel>
      )}
      <IonSelect
        className={style['selectinput_field']}
        placeholder={placeholder}
        onIonChange={e => {
          setValue(e.detail.value!);
          onChange(e.detail.value!);
        }}
        multiple={multiple}
        value={value}
      >
        {options.map(function(item, index) {
          return (
            <IonSelectOption key={index} value={item.value}>
              {item.text}
            </IonSelectOption>
          );
        })}
      </IonSelect>
    </div>
  );
};

export default SmallSelectInput;
