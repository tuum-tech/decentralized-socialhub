import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import style from './style.module.scss';
import { IonButton, IonIcon } from '@ionic/react';
import { syncOutline, alertCircle } from 'ionicons/icons';
import { SyncService } from 'src/services/sync.service';
import { Guid } from 'guid-typescript';
const ButtonOrange = styled(IonButton)`
  border-radius: 6px;
  background-color: #ffffff;

  text-align: center;
  font: 'SF Pro Display';
  text-transform: none;
  letter-spacing: 0px;
  color: #f7fafc;
  font-size: 12px;
  font-weight: 600;
  --background: #d37321 0% 0% no-repeat padding-box;
  --background-activated: #d37311 0% 0% no-repeat padding-box;
  margin-top: 8px;
  float: right;
  &:hover {
    --background-hover: #ffffff 0% 0% no-repeat padding-box;
  }
`;
interface SyncBarProps {
  session: ISessionItem;
}

const SyncBar: React.FC<SyncBarProps> = ({ session }: SyncBarProps) => {
  const history = useHistory();
  const [hasDifferences, setHasDifferences] = useState(false);

  const [id] = useState(Guid.create().toString());

  //NO CALLBACK
  useEffect(() => {
    // TODO: Uncomment this once Sync works again
    /* if (session && session.isEssentialUser) {
      console.log('Sync disabled');
      return;
    } */
    return;

    const timer = setInterval(async () => {
      // console.log('Verify differences', new Date().toISOString(), id);
      if (session && session.did !== '' && session.onBoardingCompleted) {
        let hasDiff = await SyncService.HasDifferences(session);
        setHasDifferences(hasDiff);
      }
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, [session, id]);

  const divBar = () => {
    return (
      <div className={style['syncbar']}>
        <span>
          <IonIcon icon={alertCircle}></IonIcon> &nbsp; Please sync your profile
          with the blockchain.
        </span>
        <ButtonOrange onClick={async () => history.push('/sync')}>
          <IonIcon icon={syncOutline}></IonIcon> &nbsp; Review &amp; Sync
        </ButtonOrange>
      </div>
    );
  };
  return <>{hasDifferences && divBar()}</>;
};

export default SyncBar;
