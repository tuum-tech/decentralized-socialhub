import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import style from './style.module.scss';
import { IonButton, IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { syncOutline, alertCircle } from 'ionicons/icons';
import { SyncService } from 'src/services/sync.service';
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

  const verifyDifferences = useCallback(async () => {
    if (session && session.did !== '' && session.tutorialStep === 4) {
      let hasDiff = await SyncService.HasDifferences(session);
      console.log('Hass differences', hasDiff);
      setHasDifferences(hasDiff);
    }
  });

  useEffect(() => {
    (async () => {
      await verifyDifferences();
    })();
    setTimerForVerifyDifferences();
  }, [setTimerForVerifyDifferences, verifyDifferences]);

  const setTimerForVerifyDifferences = useCallback(() => {
    const timer = setTimeout(async () => {
      await verifyDifferences();
      setTimerForVerifyDifferences();
    }, 1000 * 10);
    return () => clearTimeout(timer);
  });

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
