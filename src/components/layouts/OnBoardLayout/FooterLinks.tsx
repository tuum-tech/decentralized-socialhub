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
  color: #e2e8f0;
`;

export const Footer = styled.div`
  position: absolute;
  bottom: 35px;
  left: 39px;
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
      <a href="https://www.tuum.tech/products/profile">
        <FooterLink>About Profile</FooterLink>
      </a>
      <span>&#183;</span>
      <a href="https://www.tuum.tech">
        <FooterLink>Tuum.tech</FooterLink>
      </a>
    </>
  );
};

export default FooterLinks;
