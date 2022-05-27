import React from 'react';
import { IonCard, IonRow } from '@ionic/react';
import styled from 'styled-components';
import { getThemeData } from 'src/utils/template';
import icon_eth from 'src/assets/space/eth.svg';
import icon_ela from 'src/assets/space/ela.svg';
import style from './Item.module.scss';
import { shortenAddress } from 'src/utils/web3';

export const CardWrapper = styled(IonCard)<ThemeProps>`
  background-color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'backgroundColor')};

  box-shadow: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'cardShadow')};

  border-radius: 16px;
  margin: 0px;
  padding: 10px 10px 23px;
`;
interface IProps {
  data: any;
}

const Item: React.FC<IProps> = ({ data }: IProps) => {
  const flattenUrl = (url: string) => {
    if (url.startsWith('ipfs://'))
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    return url;
  };
  return (
    <CardWrapper template={'default'}>
      <IonRow>
        <img src={flattenUrl(data.image_url)} alt={data.image_url} />
      </IonRow>
      <IonRow className="ion-justify-content-between ion-no-padding">
        <div className={style['name']}>
          <h1>{data.collection}</h1>
          <h2>{data.name}</h2>
        </div>
        {data.last_sale && (
          <div className={style['price']}>
            <h1>
              <img
                src={data.last_sale.token === 'ETH' ? icon_eth : icon_ela}
                width="20px"
                alt="last sale"
              />
              {data.last_sale.token}
            </h1>
            <h2>{data.last_sale.price}</h2>
          </div>
        )}
        <div className={style['name']}>
          <h2>
            <b>Owned by</b> {shortenAddress(data.owner)}
          </h2>
        </div>
      </IonRow>
    </CardWrapper>
  );
};

export default Item;
