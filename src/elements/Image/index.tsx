import React from 'react';

import noimg from '../../assets/no-img.png';

interface Props {
  src?: any;
  alt?: string;
  maxWidth?: string;
  width?: string;
  height?: string;
}

const Image: React.FC<Props> = ({ src, alt, maxWidth, width, height }) => {
  const style = {
    width: width ? width : '100%',
    height: height ? height : 'auto',
    maxWidth: maxWidth ? maxWidth : '100%'
  };
  return (
    <img
      alt={alt || 'alt'}
      style={style}
      src={src ? src : noimg}
      onError={(e: any) => {
        e.persist();
        e.target.onerror = null;
        e.target.src = noimg;
      }}
    />
  );
};

export default Image;
