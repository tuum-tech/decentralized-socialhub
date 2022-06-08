import React from 'react';
import styled from 'styled-components';
import { IonCard } from '@ionic/react';

import { LinkButton } from 'src/elements-v2/buttons';

const Container = styled(IonCard)<{ noBorder: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 185px 20px;
  background: #ffffff;
  box-shadow: ${props =>
    props.noBorder
      ? 'none'
      : '0px 0px 1px rgba(12, 26, 75, 0.24), 0px 3px 8px -1px rgba(50, 50, 71, 0.05)'};
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

    max-width: 354px;
  }
`;

interface Props {
  img: string;
  title: string;
  description: string;
  buttonLink?: string;
  buttonTitle?: string;
  noBorder?: boolean;
}

const NoDataCard: React.FC<Props> = ({
  img,
  title,
  description,
  buttonLink,
  buttonTitle,
  noBorder = true
}: Props) => {
  return (
    <Container noBorder={noBorder}>
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
