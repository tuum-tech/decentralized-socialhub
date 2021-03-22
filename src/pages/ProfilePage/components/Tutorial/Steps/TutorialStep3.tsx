import { IonButton, IonInput, IonRadio, IonRadioGroup } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { ITutorialStepProp } from './TutorialStep1';
import style from '../style.module.scss';
import tuumlogo from '../../../../../assets/tuumtech.png';
import { DidService } from 'src/services/did.service';
import { UserService } from 'src/services/user.service';
import { HiveService } from 'src/services/hive.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { UserVaultScripts } from 'src/scripts/uservault.script';

const TutorialStep3Component: React.FC<ITutorialStepProp> = ({
  onContinue,
  setLoading
}) => {
  const [hiveUrl, sethiveUrl] = useState('');
  const [hiveDocument, setHiveDocument] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selected, setSelected] = useState(
    hiveDocument === '' ? 'tuum' : 'document'
  );

  const getEndpoint = () => {
    if (selected === 'document') return hiveDocument;
    if (selected === 'tuum') return `${process.env.REACT_APP_TUUM_TECH_HIVE}`;
    return hiveUrl;
  };

  const isEndpointValid = (endpoint: string) => {
    if (!endpoint || endpoint.length === 0) return false;
    let regexp = new RegExp(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    );
    return regexp.test(endpoint);
  };

  const saveSelection = async () => {
    setErrorMessage('');
    let endpoint = getEndpoint();
    let endpointValid = isEndpointValid(endpoint);

    if (!endpointValid || !setLoading) {
      setErrorMessage('Invalid hive address');
      return;
    }

    setLoading(true);
    let isValidHiveAddress = await HiveService.isHiveAddressValid(endpoint);
    if (!isValidHiveAddress) {
      setLoading(false);
      setErrorMessage('Invalid hive address');
      return;
    }

    let user = UserService.GetUserSession();
    if (user) {
      try {
        let userToken = await generateUserToken(user.mnemonics, endpoint);
        user.userToken = userToken;
        user.tutorialStep = 4;
        user.hiveHost = endpoint;

        //TODO: Uncomment when did publishing was fixed
        // if (selected !== "document")
        // {
        //   let userDid = await DidService.loadDid(user.mnemonics);
        //   let hivesvc = DidService.generateService(userDid, 'HiveVault', endpoint);
        //   let documentState = await DidDocumentService.getUserDocument(user)
        //   let userDocument = documentState.diddocument;
        //   await DidService.addServiceToDIDDocument(userDocument, hivesvc);
        //   await DidDocumentService.publishUserDocument(userDocument);
        // }

        await UserService.updateSession(user);
        let hiveInstance = await HiveService.getSessionInstance();
        await UserVaultScripts.Execute(hiveInstance!);

        onContinue();
      } catch (error) {
        await DidDocumentService.reloadUserDocument();
        setErrorMessage(
          'We are not able to process your request at moment. Please try again later'
        );
      }
    }
    setLoading(false);
  };

  const generateUserToken = async (mnemonics: string, address: string) => {
    let challenge = await HiveService.getHiveChallenge(address);
    let presentation = await DidService.generateVerifiablePresentationFromUserMnemonics(
      mnemonics,
      '',
      challenge.issuer,
      challenge.nonce
    );
    const userToken = await HiveService.getUserHiveToken(address, presentation);

    return userToken;
  };

  useEffect(() => {
    (async () => {
      let sessionUser = UserService.GetUserSession();
      if (!sessionUser) return;
      let doc = await DidService.getDidDocument(sessionUser.did);
      if (doc.service && doc.service.length > 0) {
        setSelected('document');
        setHiveDocument(doc.service[0].serviceEndpoint);
      }
    })();
  }, []);

  return (
    <div>
      <h2>Decentralized Storage(Hive Vault)</h2>
      <p>
        You can choose to store all your personal and application data to your
        own storage as long as the storage is an Elastos Hive Node. By default,
        you are choosing to store your data on a vault provided by{' '}
        <b>Tuum Tech</b>. You can also run your own Hive Node and choose that
        instead where you are in full control of your entire data! To learn more
        about how to run your own Hive Node, refer to{' '}
        <a
          href="https://github.com/elastos/Elastos.NET.Hive.Node"
          target="_blank"
        >
          Elastos Hive Node
        </a>
        .
      </p>

      <div className={style['tutorial-hive']}>
        <IonRadioGroup
          value={selected}
          onIonChange={e => {
            e.preventDefault();
            setSelected(e.detail.value!);
            e.cancelBubble = true;
          }}
        >
          {hiveDocument !== '' && (
            <div className={style['tutorial-hive-row']}>
              <IonRadio value="document"></IonRadio>

              <div className={style['tutorial-hive-item']}>
                <p>
                  <span className={style['tutorial-hive-item-title']}>
                    {hiveDocument}
                  </span>
                  <span className={style['tutorial-hive-item-description']}>
                    Using the default detected vault
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className={style['tutorial-hive-row']}>
            <IonRadio value="tuum"></IonRadio>

            <div className={style['tutorial-hive-item']}>
              <img src={tuumlogo} />

              <h2>Tuum Tech</h2>
            </div>
          </div>
          <div className={style['tutorial-hive-row']}>
            <IonRadio value="other"></IonRadio>
            <IonInput
              disabled={selected !== 'other'}
              value={hiveUrl}
              onIonChange={e => {
                e.preventDefault();
                sethiveUrl(e.detail.value!);
                e.cancelBubble = true;
              }}
              placeholder="Enter your vault url"
            ></IonInput>
          </div>
        </IonRadioGroup>
      </div>
      {errorMessage !== '' && (
        <div className={style['tutorial-step3-error']}>{errorMessage}</div>
      )}
      <IonButton onClick={saveSelection} className={style['tutorial-button']}>
        Continue
      </IonButton>
    </div>
  );
};

export default TutorialStep3Component;
