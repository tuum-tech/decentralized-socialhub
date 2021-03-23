import React from 'react';
import styled from 'styled-components';
import style from './style.module.scss';

interface IProps {
  mode: string;
}

const ProfileBanner: React.FC<IProps> = ({ mode }: IProps) => {
  // return <img src={banner} className={style['banner']} alt='banner' />;

  return (
    <>
      {mode === 'sticky' ? (
        <BannerEmpty className={style['banner']}></BannerEmpty>
      ) : (
        <Banner className={style['banner']}></Banner>
      )}
    </>
  );
};

export default ProfileBanner;

const Banner = styled.div`
  display: flex;
  position: sticky;
  top: 0px;
  height: 176px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 110, 110, 1);
  font-family: 'SF Pro Display';
  font-size: 56px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  box-shadow: 0px 3px 3px #00000005;

  margin-top: 0px;
  width: 100%;
  padding-bottom: 2px;
`;

const BannerEmpty = styled.div`
  z-index: -10;
  display: flex;
  position: sticky;
  top: 0px;
  height: 166px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: none;
  font-family: 'SF Pro Display';
  font-size: 56px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  box-shadow: 0px 3px 3px #00000005;

  margin-top: 0px;
  width: 100%;
  padding-bottom: 2px;
`;
