import React from 'react';
import { IonCard, IonRow } from '@ionic/react';
import styled from 'styled-components';
import { getThemeData } from 'src/utils/template';
import img_nft_item from 'src/assets/space/nft_item.jpg';
import icon_eth from 'src/assets/space/eth.svg';
import style from './Item.module.scss';

export const CardWrapper = styled(IonCard)<ThemeProps>`
  background-color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'backgroundColor')};

  box-shadow: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'cardShawdow')};

  border-radius: 16px;
  margin: 0px;
  padding: 10px 10px 23px;
`;
interface IProps {}

const Item: React.FC<IProps> = ({}: IProps) => {
  return (
    <CardWrapper template={'default'}>
      <IonRow>
        <img src={img_nft_item} />
      </IonRow>
      <IonRow className="ion-justify-content-between ion-no-padding">
        <div className={style['name']}>
          <h1>Bored Ape Yatch Club</h1>
          <h2>#12345</h2>
        </div>
        <div className={style['price']}>
          <h1>
            <img src={icon_eth} />
            ETH
          </h1>
          <h2>999.99</h2>
        </div>
      </IonRow>
    </CardWrapper>
  );
};

export default Item;
