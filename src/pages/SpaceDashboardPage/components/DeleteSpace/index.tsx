import React from 'react';
import {
  IonCardTitle
} from '@ionic/react';
import styled from 'styled-components';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import { StyledButton } from 'src/elements/buttons';

const Title = styled(IonCardTitle)`
  h1 {
    font-size: 20px !important;
    font-weight: 600;
    line-height: 27px;
    color: #ff5a5a;
    margin-bottom: 0px;
  }
  p {
    font-size: 12px !important;
    font-weight: 400;
    line-height: 19px;
    color: #425466;
  }
`;

interface IProps {
  profile: any;
  removeSpace: () => void;
}

const DeleteSpace: React.FC<IProps> = ({ profile, removeSpace }: IProps) => {
  return (
    <CardOverview template={'default'}>
      <CardHeaderContent>
        <Title>
          <h1>Delete Space</h1>
          <p>This will remove all the information linked to this space</p>
        </Title>
      </CardHeaderContent>
      <CardContentContainer>
        <StyledButton
          width="177px"
          color="#ff5a5a"
          bgColor="rgba(255, 90, 90, 0.1)"
          onClick={removeSpace}
        >
          Delete
        </StyledButton>
      </CardContentContainer>
    </CardOverview>
  );
};

export default DeleteSpace;
