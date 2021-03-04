import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Text12 = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
`

export const Text14 = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
`

export const Text16 = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
`

export const Text18 = styled.p`
  font-weight: 400;
  font-size: 18px;
  line-height: 30px;
`

export const Text28 = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 38px;
`

export const Title40 = styled.p`
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
`

interface TextLinkProps {
  width?: number
  color?: string
}
export const TextLink = styled(Link)<TextLinkProps>`
  width: 100%;
  ${(props) => {
    if (props.width) {
      return `max-width: ${props.width}px;`
    }
  }}
  display: block;
  color: white;
  ${(props) => {
    if (props.color) {
      return `color: ${props.color};`
    }
  }}
  margin-top: 9px;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;

  text-decoration-line: underline;

  &:hover {
    color: white;
    ${(props) => {
      if (props.color) {
        return `color: ${props.color};`
      }
    }}
  }
`
