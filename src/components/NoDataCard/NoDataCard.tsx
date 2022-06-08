import React from 'react';
import styled from 'styled-components';
import { IonCard } from '@ionic/react';

import { LinkButton } from 'src/elements-v2/buttons';

const Container = styled(IonCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 185px 20px;
  background: #ffffff;
  box-shadow: none;
  border-radius: 16px;

  @media (max-width: 575.98px) {
    padding: 60px 20px;
  }

  img {
    width: 162px;
  }

  color: #27272e;

  .title {
    margin-top: 34px;
    margin-bottom: 10px;

    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 136.52%;
    text-align: center;
  }

  .description {
    margin-bottom: 32px;

    font-family: SF Pro Display;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 162.02%;
    text-align: center;

    max-width: 246px;
  }
`;

interface Props {
  img: string;
  title: string;
  description: string;
  buttonLink?: string;
  buttonTitle?: string;
}

const NoDataCard: React.FC<Props> = ({
  img,
  title,
  description,
  buttonLink,
  buttonTitle
}: Props) => {
  return (
    <Container>
      <img src={img} alt="no-img" />
      <p className="title">{title}</p>
      <p className="description">{description}</p>
      {buttonLink && buttonTitle && (
        <LinkButton
          variant="outlined"
          btnColor="primary-gradient"
          textType="gradient"
          href={buttonLink}
        >
          {buttonTitle}
        </LinkButton>
      )}
    </Container>
  );
};

export default NoDataCard;
