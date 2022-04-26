import { IonSlide, IonSlides } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import { useBreakpoint } from 'styled-breakpoints/react-styled';

const StyledIonSlide = styled(IonSlide)`
  text-align: left;
`;

const slideOpts = {
  initialSlide: 0,
  speed: 400,
  slidesPerView: 1.2,
  spaceBetween: 22,
  centeredSlides: false
};

interface IProps {
  children: React.ReactNode;
}

const Slides: React.FC<IProps> = ({ children }: IProps) => {
  const elements = React.Children.toArray(children);
  const isSmDown = useBreakpoint(down('sm'));

  return (
    <>
      {isSmDown ? (
        <IonSlides pager={false} options={slideOpts}>
          {elements.map((element, index) => (
            <StyledIonSlide key={index}>{element}</StyledIonSlide>
          ))}
        </IonSlides>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Slides;
