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

export { ButtonLink, ArrowButton, SocialButton, ButtonWithLogo }
