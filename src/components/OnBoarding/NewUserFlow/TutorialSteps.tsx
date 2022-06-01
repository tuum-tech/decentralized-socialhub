import React from 'react';
import styled from 'styled-components';

export interface Props {
  step: number;
}

const Container = styled.div`
  width: 100%;
  position: relative;
  height: 100px;
  display: block;
`;

const Timeline = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  width: 100%;

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 160%;

  text-align: center;

  ul {
    width: 100% !important;
  }

  li {
    list-style: none;
    float: left;
    width: 20%;
    position: relative;
    text-align: center;
    font-family: 'SF Pro Display';
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    /* or 150% */

    text-align: center;

    color: #718096;
  }

  li:before {
    content: ' ';
    width: 25px;
    height: 25px;
    border: 2px solid transparent;
    border-radius: 50%;
    display: block;
    text-align: center;
    line-height: 25px;
    margin: 0 auto 10px auto;
    background: #e2e8f0;
    transition: all ease-in-out 0.3s;
  }

  li:after {
    content: '';
    position: absolute;
    width: 100%;
    border: 1px solid #e2e8f0;
    height: 1px;
    top: 12.5px;
    margin-left: -10px;

    transition: all ease-in-out 0.3s;
  }

  li.next:after {
    background-color: #2fd5dd;
    transition: all ease-in-out 0.3s;
  }

  li:last-child:after {
    content: none;
    width: 0px;
    border: none;
  }

  li.active {
    color: #04032b;
  }
  li.active:after {
    border: 1px solid #2fd5dd;
  }
  li.active:before {
    background: #2fd5dd;
    color: #2fd5dd;
  }
`;

const TutorialSteps: React.FC<Props> = ({ step }) => {
  const getBackcircle = (step: number) => {
    if (step === 1) return 'tutorial-circle-1';
    if (step === 2) return 'tutorial-circle-2';
    if (step === 3) return 'tutorial-circle-3';
    if (step === 4) return 'tutorial-circle-4';

    return 'tutorial-circle-5';
  };

  return (
    <Container>
      <Timeline>
        <li className={'active ' + (step > 1 ? 'next' : '')}>Wallet</li>
        <li
          className={
            (step > 1 ? 'active' : getBackcircle(step)) +
            ' ' +
            (step > 2 ? 'next' : '')
          }
        >
          Identity
        </li>
        <li
          className={
            (step > 2 ? 'active' : getBackcircle(step)) +
            ' ' +
            (step > 3 ? 'next' : '')
          }
        >
          Connect
        </li>
        <li
          className={
            (step > 3 ? 'active' : getBackcircle(step)) +
            ' ' +
            (step > 4 ? 'next' : '')
          }
        >
          Storage
        </li>
        <li className={step > 4 ? 'active' : getBackcircle(step)}>Complete</li>
      </Timeline>
    </Container>
  );
};

export default TutorialSteps;
