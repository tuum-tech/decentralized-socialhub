import React from 'react';
import styled from 'styled-components';
import banner from '../../assets/banner.png';
import style from './style.module.scss';

const ProfileBanner: React.FC = () => {
  // return <img src={banner} className={style['banner']} alt='banner' />;

  return <Banner>Digital Wellbeing</Banner>
};

export default ProfileBanner;

const Banner = styled.div`
width: 135px;
display: flex;
height: 180px;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 10px;
background-color: rgba(255,110,110, 0.97);
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
border-radius: 19px 19px 0px 0px;
margin-top: 5px;
width: 100%;


`;