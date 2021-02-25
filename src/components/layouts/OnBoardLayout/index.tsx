import styled from 'styled-components'
import { IonPage, IonImg } from '@ionic/react'

import { Title40, Text18, Text12, Text28 } from 'src/components/texts'

export const OnBoardLayoutLogo = styled(IonImg)`
  margin: 35.23px 39.95px;
  width: 126.6px;
`

export const WavingHandImg = styled(IonImg)`
  width: 38px;
`

export const OnBoardLayout = styled.div`
  font-style: normal;
  height: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 40% 60%;
`

export const OnBoardLayoutLeft = styled.div`
  background-color: var(--theme-primary-blue);
  border-radius: 0px;
  color: #ffffff;
  position: relative;
`

export const OnBoardLayoutLeftContent = styled.div`
  width: 100%;
  max-width: 70%;
  display: block;
  margin: 132px auto;
`

export const OnBoardLayoutLeftContentTitle = styled(Title40)`
  margin-top: 18px;
`

export const OnBoardLayoutLeftContentDescription = styled(Text18)`
  margin-top: 25px;
  margin-bottom: 25px;
`

export const OnBoardLayoutLeftContentIntro = styled(Text12)`
  margin-bottom: 25px;
`

export const OnBoardLayoutRight = styled.div`
  background: #fbfbfd;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const OnBoardLayoutRightContent = styled.div`
  width: 62%;
  margin: 161px auto;
  color: var(--txt-heading-dark);
  margin: 50px auto;
`

export const OnBoardLayoutRightContentTitle = styled(Text28)`
  margin-bottom: 12px;
`
