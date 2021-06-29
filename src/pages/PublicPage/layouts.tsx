import { IonPage, IonRow } from '@ionic/react';
import styled from 'styled-components';

import theme from 'src/data/theme';

export const ContentRow = styled(IonRow)<ThemeProps>`
  background-color: ${({ template }: ThemeProps) =>
    (theme as any)[template].pageBg};
  padding: 16px;
`;

export const Container = styled(IonPage)`
  height: 100%;

  .profilepagegrid {
    background-color: #f7fafc;
    width: 100%;
  }

  .content-scroll {
    --padding-top: 420px !important;
    --background: #f7fafc;
  }
  .navigation-bar {
    width: 100%;
    height: 83px;
    padding: 21px 0 0;
    background-color: #ffffff;
  }

  .header {
    background-color: white;
    height: 60px;
    box-shadow: 0px 3px 6px #00000007;

    .profile-img {
      margin-top: 5px;
      margin-right: 22px;
      float: right;
      width: 40px;
      height: 40px;
    }

    ion-col {
      padding: 0px;
    }
  }

  .search-input {
    margin-top: 5px;
    height: 40px;
    --background: #f5f5f5 0% 0% no-repeat padding-box;
    --placeholder-font-style: 'Open Sans';
    font-size: 12px;
    border: none;
    --box-shadow: none;
  }

  .counter {
    text-align: center;
    font-size: 56px;
  }

  .simple-resp {
    color: #899092;
    font-style: italic;
  }

  .left-panel {
    background-color: #fafaff;
  }

  .right-panel {
    background-color: #fafaff;
  }

  .logo {
    margin-left: 10px;
    margin-top: 5px;
  }

  .home {
    text-align: center;
    width: 100px;
    height: 100%;

    img {
      margin-left: 40px;
      align-self: center;
      margin-bottom: 3px;
      display: block;
      height: 19px;
    }

    span {
      display: block;
      text-align: center;
      color: black;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      letter-spacing: -0.5px;
    }
  }

  .community {
    text-align: center;
    width: 100px;
    img {
      margin-left: 40px;
      margin-bottom: 3px;
      height: 19px;
      display: flex;
      align-self: center;
    }

    span {
      text-align: left;
      color: #9dafbd;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      letter-spacing: -0.5px;
    }
  }

  .pages {
    text-align: center;
    width: 100px;
    img {
      margin-left: 40px;
      margin-bottom: 3px;
      display: block;
      height: 19px;
    }

    span {
      text-align: left;
      color: #9dafbd;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      letter-spacing: -0.5px;
    }
  }

  .messages {
    text-align: center;
    width: 100px;
    align-self: center;
    img {
      margin-left: 40px;
      margin-bottom: 3px;
      display: block;
      align-self: center;
      height: 19px;
    }

    span {
      color: #9dafbd;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      letter-spacing: -0.5px;
    }
  }
`;

export const ProfileComponentContainer = styled.div`
  height: 100%;
`;
