import { IonButton } from '@ionic/react';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import Icon from './icons';

const StyledContainer = styled.div`
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${down('sm')} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyleTitle = styled.p`
  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 136.02%;
  /* or 38px */
  color: #27272e;
`;

const StyledLabel = styled.label`
  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #425466;
`;

interface IProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  backUrl?: string;
}

const HeaderMenu: React.FC<IProps> = ({
  title,
  subtitle,
  back = false,
  backUrl
}: IProps) => {
  const history = useHistory();

  const goBack = useCallback(() => {
    if (backUrl) {
      history.push(backUrl);
    } else {
      history.goBack();
    }
  }, [history, backUrl]);

  return (
    <StyledItem>
      {back && (
        <IonButton fill="clear" class="ion-no-padding" onClick={goBack}>
          <Icon
            name="arrow-back-outline"
            style={{ width: 18, height: 18, paddingRight: 24 }}
            color="dark"
          />
        </IonButton>
      )}
      <StyledContainer>
        <StyleTitle className="ion-no-padding">{title}</StyleTitle>
        {subtitle && <StyledLabel>{subtitle}</StyledLabel>}
      </StyledContainer>
    </StyledItem>
  );
};

export default HeaderMenu;
