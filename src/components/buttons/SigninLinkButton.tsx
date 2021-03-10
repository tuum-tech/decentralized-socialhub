import React from 'react'
import styled from 'styled-components'

interface Props {
  width?: number
  color?: string
  onClick?: () => void
}

const Container = styled.div`
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

const SigninLinkButton: React.FC<Props> = () => {
  return (
    <Container
      onClick={() => {
        console.log('======<test')
      }}
    >
      Sign In
    </Container>
  )
}

export default SigninLinkButton
