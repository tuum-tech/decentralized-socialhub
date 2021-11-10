import { IonCard, IonText, IonRow } from '@ionic/react';
import styled from 'styled-components';

const Title = styled(IonText)`
  display: block;
  font-weight: bold;
  letter-spacing: -0.005em;
  color: #425466;
`;

const SpaceLg = styled(IonRow)`
  margin: 34px;
`;

const SpaceMd = styled(IonRow)`
  margin: 22px;
`;

const SpaceLs = styled(IonRow)`
  margin: 10px;
`;

const Section = styled('div')``;

const SectionTitle = styled(Title)`
  font-size: 20px;
  margin-top: 10px;
`;

const SectionText = styled(IonText)`
  font-size: 12px;
  & p {
    padding: 10px 0;
  }
`;

const SectionSubTitle = styled(Title)`
  font-size: 16px;
  margin-top: 10px;
`;

const LightBox = styled(IonCard)`
  display: flex;
  background: #f3f9ff;
  padding: 15px;
  margin: 0;
  & svg {
    width: 70px;
    height: 40px;
    padding: 0 5px;
  }
  & ion-text {
    padding: 0 5px;
  }
`;

const PrimaryText = styled(IonText)`
  color: var(--theme-primary-blue);
`;

const PageTitle = styled(Title)`
  font-size: 20px;
`;

const PageCategory = styled(Title)`
  font-size: 16px;
`;

const Indent = styled('div')`
  padding-left: 15px;
`;

const CountLabel = styled.div`
  background: #edf2f7;
  border-radius: 9px;
  padding: 2px 12px;
  margin: 0px 10px;
  font-size: 13px;
  font-weight: normal;
  display: inline-flex;
`;

export {
  Title,
  Section,
  SectionTitle,
  SectionSubTitle,
  SectionText,
  SpaceLg,
  SpaceMd,
  SpaceLs,
  LightBox,
  PrimaryText,
  PageTitle,
  PageCategory,
  Indent,
  CountLabel
};
