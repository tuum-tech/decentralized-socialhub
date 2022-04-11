import React, { FC } from 'react';
import styled from 'styled-components';
import { AnimationBuilder, IonRouterLink } from '@ionic/react';
import { ButtonProps } from './types';
import style from './Button.module.scss';
import GradientText from './GradientText';
import ButtonText from './ButtonText';
import Icon from '../icons/Icon';

const StyledLinkButton = styled(IonRouterLink)<LinkButtonProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px 11px;
  width: 160px;
  height: ${props =>
    props.size === 'large' ? '43px' : props.size === 'small' ? '28px' : '33px'};
  border-radius: 7px;
`;

const StyledDivCenter = styled.div`
  display: flex;
  align-items: center;
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
  icon,
  color,
  ...props
}: LinkButtonProps) => {
  let backStyle = '';
  let fontColor = '';
  let styles = {};
  if (variant === 'contained') {
    backStyle =
      color === 'primary-gradient' || color === 'secondary-gradient'
        ? style[color]
        : '';
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
    backStyle =
      color === 'primary-gradient' ? style['border-primary-gradient'] : '';
    let borderColor =
      color === 'primary'
        ? 'var(--ion-color-primary)'
        : color === 'secondary'
        ? 'var(--ion-color-secondary)'
        : color === 'white'
        ? 'var(--ion-color-medium)'
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
      <StyledDivCenter>
        {textType === 'gradient' ? (
          <GradientText fontSize={fontSize}>{children}</GradientText>
        ) : (
          <ButtonText fontSize={fontSize} color={fontColor}>
            {children}
          </ButtonText>
        )}
        {icon && (
          <Icon name={icon} style={{ paddingLeft: 6 }} color="medium"></Icon>
        )}
      </StyledDivCenter>
    </StyledLinkButton>
  );
};

export default LinkButton;
