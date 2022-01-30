import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const Description = styled.div``;
export const TextHeader = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;

  display: flex;
  align-items: center;
  color: #425466;
  margin-bottom: 5px;
  margin-top: 15px !important;
`;

export const ImgUploadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;

  p {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 25px;
    /* or 179% */

    text-align: center;

    color: #4c6fff;
  }

  .front,
  .back {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

export const ImgUploadArea = styled.div<{
  logo: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  transition: all 1s;
  box-shadow: 0px 0px 10px 0px #fff;

  background: #fff;
  background-image: url(${props => props.logo});
  background-repeat: no-repeat, no-repeat;
  background-position: 0 0;
  background-size: 100px 100px;
  animation: effectShow 0.4s cubic-bezier(0.1, 0.82, 0.25, 1);

  &:hover {
    transition: all 0.6s;
    box-shadow: 0px 0px 10px 5px #387289;
  }

  @keyframes effectShow {
    0% {
      transform: scale(1.4);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  button {
    &:nth-last-child(2) {
      bottom: 55px !important;
      width: 80%;
      background: #387289;

      &:hover {
        transition: all 1s;
        background: #66cbbc;
      }
    }

    position: absolute;
    bottom: 15px;
    border-radius: 20px;
    border: none;
    background: #ed3a53;
    width: 50%;
    color: #fff;
    height: 30px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      transition: all 1s;
      background: #fd637b;
    }
  }

  section {
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    margin-top: 120px;
    width: 80%;
    text-align: center;
    padding-top: 20px;
    transition: all 1.6s;

    label {
      font-size: 20px;
      margin-bottom: 8px;
      transition: all 1.6s;
    }

    span {
      transition: all 1.6s;
      font-size: 16px;
      margin-bottom: 8px;
      height: 18px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`;

export const Perfil = styled.div`
  width: 100px;
  height: 100px;
  background: transparent;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1s;

  svg {
    width: 80px;
    height: 80px;
    transition: all 1s;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    transition: all 1s;
  }

  input[type='file'] {
    opacity: 0;
    position: absolute;
    border-radius: 100%;
    cursor: pointer;
    z-index: 99999;
    width: 145px;
    height: 145px;
  }

  &:hover {
    transition: all 1s;
    box-shadow: 0px 0px 15px 2px #387289;
  }
`;
