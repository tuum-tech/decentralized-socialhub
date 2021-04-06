import React from 'react';

import { DefaultButton } from 'src/components/buttons';
import { MainCard, CardTitle, CardText } from './VerificationStatus';
import style from './style.module.scss';

const Discord = () => (
  <svg
    width="121"
    height="112"
    viewBox="0 0 121 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_f)">
      <rect x="33" y="33" width="58" height="46" fill="black" />
    </g>
    <path
      d="M88.1069 48.6875L85.6783 67.3359H67.464H43.7854L35.8926 60.1172L43.7854 34.25L63.214 28.8359L78.9997 31.8438L88.1069 48.6875Z"
      fill="white"
    />
    <path
      d="M88.0334 15H35.9666C33.8497 15.0051 31.8214 15.8428 30.3276 17.3289C28.8338 18.8151 27.9966 20.8281 28 22.9256V74.9772C27.9966 77.0747 28.8338 79.0877 30.3276 80.5738C31.8214 82.06 33.8497 82.8976 35.9666 82.9028H80.0301L77.9699 75.7805L82.9422 80.3623L87.6443 84.6742L95.9978 91.9872V22.9256C96.0013 20.8285 95.1644 18.8158 93.671 17.3297C92.1777 15.8436 90.15 15.0057 88.0334 15V15ZM73.0343 65.2823C73.0343 65.2823 71.6355 63.6265 70.4703 62.1635C73.2885 61.5078 75.7815 59.8846 77.5072 57.5817C76.1092 58.5036 74.61 59.2653 73.0386 59.8522C71.2312 60.6171 69.3407 61.1727 67.4047 61.508C64.077 62.116 60.664 62.1029 57.3411 61.4695C55.3902 61.0914 53.4783 60.5372 51.6294 59.8137C50.6551 59.4416 49.7075 59.0043 48.793 58.5049C48.6763 58.4278 48.5596 58.3892 48.4428 58.3121C48.3842 58.2833 48.3315 58.2441 48.2872 58.1964C47.5867 57.8109 47.2062 57.541 47.2062 57.541C48.869 59.7942 51.2739 61.4012 54.0053 62.0842C52.8401 63.5473 51.4111 65.2802 51.4111 65.2802C49.1029 65.3415 46.8149 64.8398 44.7484 63.8194C42.6818 62.7989 40.9 61.291 39.5596 59.4281C39.6796 51.6243 41.586 43.9493 45.1351 36.9816C48.2648 34.5465 52.0803 33.1341 56.0548 32.9396L56.444 33.4023C52.705 34.3197 49.2159 36.0421 46.2247 38.4468C46.2247 38.4468 47.0895 37.9841 48.5163 37.3308C51.3093 36.0675 54.2861 35.2491 57.3368 34.906C57.5547 34.8613 57.776 34.8355 57.9984 34.8289C60.6025 34.4927 63.2378 34.4668 65.8482 34.7518C69.9525 35.2167 73.9255 36.4719 77.544 38.4468C74.7047 36.1568 71.4073 34.49 67.8695 33.5565L68.4143 32.9396C72.3888 33.1344 76.2042 34.5467 79.334 36.9816C82.8899 43.9477 84.803 51.6228 84.929 59.4281C83.5779 61.2892 81.7885 62.7952 79.7162 63.8151C77.644 64.835 75.3517 65.3379 73.0386 65.2802L73.0343 65.2823ZM54.9652 47.302C53.8741 47.3786 52.8529 47.8621 52.1072 48.6551C51.3616 49.4481 50.947 50.4916 50.947 51.5754C50.947 52.6592 51.3616 53.7027 52.1072 54.4957C52.8529 55.2887 53.8741 55.7722 54.9652 55.8488C55.5096 55.8262 56.0442 55.6974 56.5382 55.4697C57.0323 55.242 57.4761 54.9199 57.8443 54.5219C58.2124 54.1239 58.4977 53.6578 58.6836 53.1503C58.8696 52.6428 58.9526 52.104 58.928 51.5647C58.9555 51.0252 58.8745 50.4857 58.6894 49.9776C58.5044 49.4695 58.2192 49.003 57.8503 48.6052C57.4815 48.2075 57.0364 47.8865 56.5411 47.6609C56.0458 47.4353 55.5101 47.3096 54.9652 47.2913V47.302ZM69.1472 47.2913C68.2799 47.2193 67.4108 47.4083 66.6536 47.8336C65.8965 48.259 65.2865 48.9008 64.9035 49.6752C64.5205 50.4496 64.3823 51.3206 64.507 52.174C64.6317 53.0275 65.0134 53.8239 65.6023 54.4589C66.1911 55.094 66.9597 55.5381 67.8075 55.7333C68.6553 55.9285 69.5428 55.8657 70.354 55.5529C71.1651 55.2402 71.8621 54.6923 72.3538 53.9807C72.8456 53.2691 73.1091 52.4271 73.1099 51.5647C73.1331 51.0262 73.049 50.4885 72.8624 49.9823C72.6758 49.4761 72.3903 49.0112 72.0223 48.6144C71.6543 48.2175 71.2109 47.8964 70.7176 47.6694C70.2243 47.4424 69.6907 47.3139 69.1472 47.2913Z"
      fill="#7289DA"
    />
    <defs>
      <filter
        id="filter0_f"
        x="0"
        y="0"
        width="124"
        height="112"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="16.5" result="effect1_foregroundBlur" />
      </filter>
    </defs>
  </svg>
);

const WhatIsProfile: React.FC = ({}) => {
  return (
    <MainCard className={style['img-card']}>
      <CardTitle>Connect with our community</CardTitle>
      <CardText className={style['dark-txt']}>
        Discuss, request, support on discord
      </CardText>

      <DefaultButton width="100px" onClick={() => {}}>
        Connect
      </DefaultButton>

      <Discord />
    </MainCard>
  );
};

export default WhatIsProfile;
