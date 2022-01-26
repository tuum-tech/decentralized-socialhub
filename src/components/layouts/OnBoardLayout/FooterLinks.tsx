import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Middot = styled.span`
  content: '\b7\a0';
`;

export const FooterLink = styled.span`
  font-family: 'SF Pro Display';
  font-size: 11px;
  padding: 5px;
  color: #7a7a9d;
`;

export const Footer = styled.div`
  position: absolute;

  display: flex;
  justify-content: center;

  bottom: 0px;
  width: 100%;
`;

const FooterLinks: React.FC<any> = () => {
  return (
    <>
      <Link to="/terms-of-use">
        <FooterLink>Terms of use</FooterLink>
      </Link>
      <span>&#183;</span>
      <Link to="/support-forum">
        <FooterLink>Help Support</FooterLink>
      </Link>
      <span>&#183;</span>
      <Link to="/">
        <FooterLink>About Profile</FooterLink>
      </Link>
      <span>&#183;</span>
      <Link to="/recover-account">
        <FooterLink>Recover Account</FooterLink>
      </Link>
      <span>&#183;</span>
      <a href="https://www.tuum.tech">
        <FooterLink>Tuum.tech</FooterLink>
      </a>
    </>
  );
};

export default FooterLinks;
