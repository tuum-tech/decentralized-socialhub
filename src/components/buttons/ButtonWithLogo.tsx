import React from 'react'
import { IonText, IonImg } from '@ionic/react'

import style from './ButtonWithLogo.module.scss'
import whitelogo from '../../assets/logo/whitelogo.png'

interface Props {
  onClick?: () => void
  text?: string
  mt?: number
  mode?: string
  hasLogo?: boolean
  disabled?: boolean
}

const ButtonWithLogo: React.FC<Props> = ({
  onClick,
  text,
  mt,
  mode = 'blue',
  hasLogo = true,
  disabled = false,
}) => {
  const cName = style['logo-btn'] + ' ' + style[`${mode}-mode`]

  return (
    <div
      onClick={() => {
        if (!disabled && onClick) {
          onClick()
        }
      }}
      className={cName}
      style={{
        marginTop: mt && `${mt}px`,
        opacity: disabled ? 0.2 : 1,
      }}
    >
      {mode !== 'danger' && hasLogo && (
        <IonImg
          src={whitelogo}
          style={{ maxWidth: '25.29px', marginRight: '10.71px' }}
        />
      )}
      <IonText className={style['logo-btn_txt']}>{text}</IonText>
    </div>
  )
}

export default ButtonWithLogo
