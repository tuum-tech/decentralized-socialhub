/**
 * Page
 */

import React from 'react'

import { IonInput, IonLabel } from '@ionic/react'
import style from './TextInput.module.scss'

interface Props {
  placeholder?: string;
  label?: string;
  value?: string;
  flexDirection?: string;
  hasError?: boolean;
  readonly?: boolean,
  onChange: (e: string) => void;
  className?: string;
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
    | undefined
}

const TextInput: React.FC<Props> = ({
  placeholder,
  label,
  value,
  onChange,
  flexDirection = 'row',
  hasError = false,
  type = 'text',
  readonly = false,
  className,
}) => {
  let cName = style['textinput']
  if (flexDirection === 'column') {
    cName += ` ${style['flex-row']}`
  }
  if (hasError) {
    cName += ` ${style['hasError']}`
  }
  if (className) {
    cName += ` ${className}`
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
        readonly={readonly}
        onIonChange={(e) => onChange(e.detail.value!)}
      />
    </div>
  )
}

export default TextInput
