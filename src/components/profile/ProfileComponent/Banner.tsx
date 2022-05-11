import React, { useRef, useState, useEffect } from 'react';
import useSize from '@react-hook/size';

interface Props {
  bgImg: string;
}

const Banner: React.FC<Props> = ({ bgImg }) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [width, height] = useSize(ref);
  const [size, setSize] = useState({ width: 1056, height: 176 });
  const horView = size.width / size.height < width / height;
  const style = {
    display: 'flex',
    top: '0px',
    height: '176px',
    gap: '10px',
    marginTop: '0px',
    width: '100%',
    borderRadius: '16px 16px 0px 0px',
    paddingBottom: '2px',
    background: '#fff',
    backgroundImage: `url(${bgImg})`,
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: horView ? '0 50%' : '50% 0',
    backgroundSize: horView ? '100% auto' : 'auto 100%'
  };
  useEffect(() => {
    let isMounted = true;
    const photo = bgImg;
    const image = new Image();
    image.onload = () => {
      if (isMounted) {
        setSize({ width: image.width, height: image.height });
      }
    };
    image.src = photo;

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} style={{ ...style }}></div>;
};

export default Banner;
