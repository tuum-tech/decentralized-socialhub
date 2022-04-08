import React, { FC } from 'react';
import styled from 'styled-components';
import { AnimationBuilder, IonRouterLink } from '@ionic/react';
import { ButtonProps } from './types';
import style from './Button.module.scss';
import GradientText from './GradientText';
import ButtonText from './ButtonText';

const StyledLinkButton = styled(IonRouterLink)<ButtonProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px 11px;
  width: 100px;
  height: 33.01px;
  border-radius: 7px;
`;

interface LinkButtonProps extends ButtonProps {
  href: string;
  target?: string;
  routerAnimation?: AnimationBuilder;
  rel?: string;
}

const LinkButton: FC<LinkButtonProps> = ({
  variant,
  textType,
  bgColor,
  children,
  size = 'default',
  color,
  ...props
}: LinkButtonProps) => {
  let backStyle = '';
  let fontColor = '';
  let styles = {};
  if (variant === 'contained') {
    backStyle = color === 'gradient' ? style['dark-purple-gradient'] : '';
    let background = bgColor
      ? bgColor
      : color === 'primary'
      ? 'var(--ion-color-primary)'
      : color === 'secondary'
      ? 'var(--ion-color-secondary)'
      : '';
    if (background) {
      Object.assign(styles, { background });
    }
    fontColor = 'white';
  } else if (variant === 'outlined') {
    backStyle = color === 'gradient' ? style['border-dark-pink-gradient'] : '';
    let borderColor =
      color === 'primary'
        ? 'var(--ion-color-primary)'
        : color === 'secondary'
        ? 'var(--ion-color-secondary)'
        : '';
    if (borderColor) {
      Object.assign(styles, {
        borderColor,
        borderStyle: 'solid',
        borderWidth: 1
      });
      fontColor = borderColor;
    }
  }
  const fontSize = size === 'default' ? 13 : size === 'large' ? 15 : 12;

  return (
    <StyledLinkButton {...props} className={backStyle} style={styles}>
      {textType === 'gradient' ? (
        <GradientText fontSize={fontSize}>{children}</GradientText>
      ) : (
        <ButtonText fontSize={fontSize} color={fontColor}>
          {children}
        </ButtonText>
      )}
    </StyledLinkButton>
  );
};

export default LinkButton;
