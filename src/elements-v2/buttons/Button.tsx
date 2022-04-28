import React, { FC } from 'react';
import styled from 'styled-components';
import { IonRouterLink } from '@ionic/react';
import { ButtonProps, DefaultButtonProps, LinkButtonProps } from './types';
import styles from './Button.module.scss';
import GradientText from './GradientText';
import ButtonText from './ButtonText';
import Icon from '../icons';

function withStyle<T extends object>(
  Component: React.ComponentType<T>
): FC<T & ButtonProps> {
  const StyledButton = styled(Component)<T & ButtonProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 6px 11px;
    padding: 0px 20px;
    width: fit-content;
    height: ${props =>
      props.size === 'large'
        ? '43px'
        : props.size === 'small'
        ? '28px'
        : '33px'};
    border-radius: 7px;
  `;

  const StyledDivCenter = styled.div`
    display: flex;
    align-items: center;
  `;

  return props => {
    const {
      variant,
      textType,
      bgColor,
      children,
      size = 'default',
      icon,
      btnColor,
      style: customStyle = {}
    } = props;
    let backStyle = '';
    let fontColor = '';
    let style = { ...customStyle };
    if (variant === 'contained') {
      let background =
        btnColor === 'primary-gradient' ||
        btnColor === 'secondary-gradient' ||
        btnColor === 'light-gradient'
          ? styles[btnColor]
          : bgColor
          ? bgColor
          : btnColor === 'primary'
          ? 'var(--ion-color-primary)'
          : btnColor === 'secondary'
          ? 'var(--ion-color-secondary)'
          : '';
      if (background) {
        Object.assign(style, { background });
      }
      fontColor = 'white';
    } else if (variant === 'outlined') {
      backStyle =
        btnColor === 'primary-gradient'
          ? styles['border-primary-gradient']
          : '';
      let borderColor =
        btnColor === 'primary'
          ? 'var(--ion-color-primary)'
          : btnColor === 'secondary'
          ? 'var(--ion-color-secondary)'
          : btnColor === 'white'
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
      <StyledButton {...(props as any)} className={backStyle} style={style}>
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
      </StyledButton>
    );
  };
}

const LinkButton = withStyle<LinkButtonProps & ButtonProps>(IonRouterLink);

const DefaultButton = withStyle((props: DefaultButtonProps) => (
  <button {...props} />
));

export { LinkButton, DefaultButton };
