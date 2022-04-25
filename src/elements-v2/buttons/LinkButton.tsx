import React, { FC } from 'react';
import styled from 'styled-components';
import { AnimationBuilder, IonRouterLink } from '@ionic/react';
import { ButtonProps } from './types';
import styles from './Button.module.scss';
import GradientText from './GradientText';
import ButtonText from './ButtonText';
import Icon from '../icons/Icon';

const StyledLinkButton = styled(IonRouterLink)<LinkButtonProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px 11px;
  padding: 0px 20px;
  width: fit-content;
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

const LinkButton: FC<LinkButtonProps> = (props: LinkButtonProps) => {
  const {
    variant,
    textType,
    bgColor,
    children,
    size = 'default',
    icon,
    color,
    style: customStyle = {}
  } = props;
  let backStyle = '';
  let fontColor = '';
  let style = { ...customStyle };
  if (variant === 'contained') {
    let background =
      color === 'primary-gradient' || color === 'secondary-gradient'
        ? styles[color]
        : bgColor
        ? bgColor
        : color === 'primary'
        ? 'var(--ion-color-primary)'
        : color === 'secondary'
        ? 'var(--ion-color-secondary)'
        : '';
    if (background) {
      Object.assign(style, { background });
    }
    fontColor = 'white';
  } else if (variant === 'outlined') {
    backStyle =
      color === 'primary-gradient' ? styles['border-primary-gradient'] : '';
    let borderColor =
      color === 'primary'
        ? 'var(--ion-color-primary)'
        : color === 'secondary'
        ? 'var(--ion-color-secondary)'
        : color === 'white'
        ? 'var(--ion-color-medium)'
        : '';
    if (borderColor) {
      Object.assign(style, {
        borderColor,
        borderStyle: 'solid',
        borderWidth: 1
      });
      fontColor = borderColor;
    }
  }
  const fontSize = size === 'default' ? 13 : size === 'large' ? 15 : 12;

  return (
    <StyledLinkButton {...props} className={backStyle} style={style}>
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
