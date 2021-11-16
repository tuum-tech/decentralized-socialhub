import { IonInput } from '@ionic/react';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px 28px;

  .title {
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
    color: #27272e;
    margin-bottom: 24px;
  }

  .intro {
    font-size: 14px;
    line-height: 160%;
    font-feature-settings: 'salt' on;
    color: #425466;
    margin-bottom: 13px;
  }

  .label {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #425466;
    margin-bottom: 6.65px;
  }

  .input-area {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;

    .error {
      font-style: normal;
      font-weight: normal;
      font-size: 11px;
      line-height: 12px;
      text-decoration-line: underline;
      color: #ff5a5a;
    }
  }

  .below {
    font-size: 11px;
    line-height: 12px;
    color: #7a7a9d;
    display: flex;

    .button {
      border-bottom: 1px solid #7a7a9d;
      font-size: 11px;
      line-height: 12px;
      color: #7a7a9d;
      background: transparent;
      padding: 0;
      margin-left: 10px;
    }

    margin-bottom: 31.9px;
  }

  .buttons {
    padding: 13px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

export const VerifyButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;

  width: 160px;
  height: 36px;

  background: #4c6fff;
  border-radius: 6px;

  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;

export const CancelButton = styled(VerifyButton)`
  background: white;
  color: #4c6fff;
  border: 1px solid #4c6fff;
  margin-right: 19px;
`;

interface CodeInputProps {
  hasError?: boolean;
}

export const CodeInput = styled(IonInput)<CodeInputProps>`
  box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
    0px 0px 1px rgba(50, 50, 71, 0.2);
  margin-right: 7px;
  border-radius: 6px;

  max-width: 294px !important;
  padding: 0px 7.5px !important;

  font-weight: 500;
  font-size: 13px !important;
  line-height: 15px !important;

  background: ${props => (props.hasError ? '#FFECEC' : '#edf2f7')} !important;
  color: ${props => (props.hasError ? 'red' : '#6b829a')};
`;
