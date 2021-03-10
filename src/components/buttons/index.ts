import { Link } from 'react-router-dom'
import styled from 'styled-components'

import ArrowButton from './ArrowButton'
import ButtonWithLogo from './ButtonWithLogo'
import SocialButton from './SocialButton'

interface ButtonLinkProps {
  width?: number
}
const ButtonLink = styled(Link)<ButtonLinkProps>`
  width: 100%;
  ${(props) => {
    if (props.width) {
      return `max-width: ${props.width}px;`
    }
  }}
  display: block;
  margin: 0;
`

const SigninLinkButton = styled.div`
  width: 100%;
  max-width: 100px
  display: block;
  margin: 0;
  text-decoration-line: underline;
  cursor: pointer;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;

  margin-top: 9px;

  &:hover {
    color: white;
    ${(props) => {
      if (props.color) {
        return `color: ${props.color};`
      }
    }}
  }
`

export {
  ButtonLink,
  ArrowButton,
  SocialButton,
  ButtonWithLogo,
  SigninLinkButton,
}
