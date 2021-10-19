import {
  DIDDocument,
  DID,
  Issuer,
  DIDURL,
  VerifiableCredential
} from '@elastosfoundation/did-js-sdk/';
import { TuumTechScriptService } from 'src/services/script.service';
import { DidService } from './did.service.new';
import { SearchService } from './search.service';
import { UserService } from './user.service';
import { ProfileService } from './profile.service';
import { getItemsFromData } from 'src/utils/script';

export enum VerificationStatus {
  requested = 'requested',
  verified = 'verified',
  rejected = 'rejected',
  savedtoidentity = 'saved to identity'
}

export class VerificationService {
  public retrieveUsersVerificationCategories(
    profile: ProfileDTO,
    session: ISessionItem
  ) {
    const { experienceDTO, educationDTO } = profile;

    let requests: VerificationData[] = [];

    // name
    if (session.name && session.name !== '') {
      const data: VerificationData = this.generateGeneralVerificatoinData(
        'name',
        'name',
        session.name
      );
      requests = requests.concat([data]);
    }

    // email
    if (
      session.loginCred &&
      session.loginCred.email &&
      session.loginCred.email !== ''
    ) {
      const data: VerificationData = this.generateGeneralVerificatoinData(
        'email',
        'email',
        session.loginCred.email
      );
      requests = requests.concat([data]);
    }

    // phone
    if (session.phone && session.phone !== '') {
      const data: VerificationData = this.generateGeneralVerificatoinData(
        'phone',
        'phone',
        session.phone
      );
      requests = requests.concat([data]);
    }

    const educationData: VerificationData[] = this.generateEducationVerificationData(
      educationDTO.items
    );
    requests = requests.concat(educationData);

    const experienceData: VerificationData[] = this.generateExperienceVerificationData(
      experienceDTO.items
    );
    requests = requests.concat(experienceData);

    return requests;
  }

  public generatePersonalInfoVerificaiotnData(
    name: string,
    email: string,
    phone: string
  ) {
    const category = 'PersonalInfo';
    const records = [];
    if (name !== '') {
      records.push({
        field: 'name',
        value: name
      });
    }
    if (email !== '') {
      records.push({
        field: 'email',
        value: email
      });
    }
    if (phone !== '') {
      records.push({
        field: 'phone',
        value: phone
      });
    }

    let idKey = 'Personal Info';

    return [
      {
        idKey,
        category,
        records
      }
    ];
  }

  public generateGeneralVerificatoinData(
    category: string,
    field: string,
    value: string
  ) {
    return {
      idKey: `${category[0].toUpperCase() + category.slice(1)}: ${value}`,
      category: category,
      records: [
        {
          field,
          value
        }
      ]
    };
  }

  public generateEducationVerificationData(items: EducationItem[]) {
    if (items.length > 0) {
      const data = [];
      for (let i = 0; i < items.length; i++) {
        const edu = items[i];
        const records = [];
        if (edu.institution) {
          records.push({
            field: 'institution',
            value: edu.institution
          });
        }
        if (edu.program) {
          records.push({
            field: 'program',
            value: edu.program
          });
        }
        if (edu.start) {
          records.push({
            field: 'start',
            value: edu.start
          });
        }
        if (edu.end) {
          records.push({
            field: 'end',
            value: edu.end
          });
        }
        const idKey = `Education: ${edu.program} at ${edu.institution}`;
        data.push({
          idKey,
          category: idKey.toLowerCase().replaceAll(' ', '_'),
          records
        });
      }
      return data;
    }
    return [];
  }

  public generateExperienceVerificationData(items: ExperienceItem[]) {
    if (items.length > 0) {
      const data = [];

      for (let i = 0; i < items.length; i++) {
        const exp = items[i];
        const records = [];
        if (exp.institution) {
          records.push({
            field: 'institution',
            value: exp.institution
          });
        }
        if (exp.title) {
          records.push({
            field: 'title',
            value: exp.title
          });
        }
        if (exp.start) {
          records.push({
            field: 'start',
            value: exp.start
          });
        }
        if (exp.end) {
          records.push({
            field: 'end',
            value: exp.end
          });
        }

        const idKey = `Experience: ${exp.title} at ${exp.institution}`;
        data.push({
          idKey,
          category: idKey.toLowerCase().replaceAll(' ', '_'),
          records
        });
      }
      return data;
    }
    return [];
  }

  public async sendRequest(
    session: ISessionItem,
    toDids: string[],
    verificationData: VerificationData[],
    msg: string
  ) {
    try {
      let userService = new UserService(await DidService.getInstance());
      for (let i = 0; i < toDids.length; i++) {
        for (let j = 0; j < verificationData.length; j++) {
          await TuumTechScriptService.addVerificationRequest(
            session.did,
            toDids[i],
            verificationData[j],
            msg,
            verificationData[j].idKey
          );
        }
        let toUser = await userService.SearchUserWithDID(toDids[i]);
        await ProfileService.addActivity(
          {
            guid: '',
            did: session.did,
            message:
              `You've sent verification request to <a href="/did/` +
              toDids[i].replaceAll('did:elastos:', '') +
              `" target="_blank">` +
              toUser.name +
              `</a>`,
            read: false,
            createdAt: 0,
            updatedAt: 0
          },
          session
        );
      }
      return {
        status: 'successed',
        error: ''
      };
    } catch (e) {
      return {
        status: 'failed',
        error: e
      };
    }
  }

  private get_content_from_verification_data(records: any[]) {
    let content = {} as any;
    for (let i = 0; i < records.length; i++) {
      const field = records[i].field;
      const value = records[i].value;
      content[field] = value;
    }
    return content;
  }

  private generate_DID_id_from_verification(
    category: string,
    from_did: string
  ) {
    let vcType = '';

    if (category.includes(':')) {
      let vcTypeStrings = category.split(':');
      vcType = vcTypeStrings[0] + 'Credential' + vcTypeStrings[1];
    } else {
      vcType = category + 'Credential';
    }

    return {
      vcType: vcType.toLowerCase(),
      DIDstring: `${from_did}#${vcType}`
    };
  }

  public async approveCredential(
    session: ISessionItem,
    v: VerificationRequest,
    approve = true,
    feedbacks = ''
  ) {
    const requester_didUrl = DID.from(v.from_did);
    if (!requester_didUrl) return;

    let vc: any = {};
    if (approve) {
      const signerDidDoc: DIDDocument = await (
        await DidService.getInstance()
      ).getStoredDocument(new DID(v.to_did));

      let issuer = new Issuer(
        signerDidDoc,
        DIDURL.from('#primary', signerDidDoc.getSubject()) as DIDURL
      );
      let vcBuilder = new VerifiableCredential.Builder(
        issuer,
        (await requester_didUrl.resolve()).getSubject() // requester did
      );

      let content = this.get_content_from_verification_data(v.records);
      const { vcType, DIDstring } = this.generate_DID_id_from_verification(
        v.category,
        v.from_did
      );

      vc = await vcBuilder
        .expirationDate(
          new Date(
            new Date().getFullYear() + 5,
            new Date().getMonth(),
            new Date().getDate()
          )
        )
        .type(vcType)
        .property(vcType, content)
        .id(DIDURL.from(DIDstring) as DIDURL)
        .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);
    }

    await TuumTechScriptService.updateVerificationRequest(
      approve ? 'approved' : 'rejected',
      feedbacks,
      approve ? vc.toJSON() : '',
      v.guid
    );
    let userService = new UserService(await DidService.getInstance());
    let fromUser = await userService.SearchUserWithDID(v.from_did);
    await ProfileService.addActivity(
      {
        guid: '',
        did: session.did,
        message:
          `You've ${
            approve ? 'approved' : 'rejected'
          } verification request from <a href="/did/` +
          v.from_did.replaceAll('did:elastos:', '') +
          `" target="_blank">` +
          fromUser.name +
          `</a>`,
        read: false,
        createdAt: 0,
        updatedAt: 0
      },
      session
    );
  }

  public async storeNewCredential(v: VerificationRequest) {
    const didService = await DidService.getInstance();
    let didDocument: DIDDocument = await didService.getStoredDocument(
      new DID(v.from_did)
    );

    // remove if exist
    const { DIDstring } = this.generate_DID_id_from_verification(
      v.category,
      v.from_did
    );
    const didUrl = DIDURL.from(DIDstring) as DIDURL;
    const existingVerifiableCredential = didDocument.getCredential(didUrl);
    if (existingVerifiableCredential) {
      const builder = DIDDocument.Builder.newFromDocument(didDocument);
      didDocument = await builder
        .removeCredential(didUrl)
        .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);
    }

    // add new credential
    const builder = DIDDocument.Builder.newFromDocument(didDocument);
    didDocument = await builder
      .addCredential(VerifiableCredential.parse(v.credential))
      .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);

    await didService.storeDocument(didDocument);

    await TuumTechScriptService.updateVerificationRequest(
      'saved to identity',
      v.feedbacks,
      v.credential,
      v.guid
    );
  }

  public async getCredentialVerifiers(
    x: any,
    type: string,
    diddocument: any
  ): Promise<[]> {
    if (!diddocument || diddocument.getCredentialCount() === 0) return [];

    const vcs = diddocument.getCredentials();

    let issuerDids: string[] = [];
    for (let i = 0; i < vcs.length; i++) {
      const subject: VerifiableCredential.Subject = vcs[i].getSubject();

      const subjectProperties = subject.getProperties();
      const key = Object.keys(subjectProperties)[0];

      let issuerDid = '';
      if (key.toLowerCase() === type.toLowerCase()) {
        issuerDid = JSON.parse(JSON.stringify(vcs[i].issuer));
      } else if (key.toLowerCase().startsWith(type.toLowerCase())) {
        const credential = Object.values(subjectProperties)[0] as any;
        if (
          x.institution === credential.institution &&
          x.program === credential.program &&
          x.start === credential.start
        ) {
          let same = false;
          if (x.still && x.start === credential.start) {
            same = true;
          } else if (x.start === credential.start && x.end === credential.end) {
            same = true;
          }
          if (same) {
            issuerDid = JSON.parse(JSON.stringify(vcs[i].issuer));
          }
        }
      }

      if (issuerDid !== '' && !issuerDids.includes(issuerDid)) {
        issuerDids.push(issuerDid);
      }
    }

    let verifiers = [];
    if (issuerDids.length > 0) {
      const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let verifiersRes: any = await searchServiceLocal.getUsersByDIDs(
        issuerDids,
        100,
        0
      );
      verifiers = getItemsFromData(verifiersRes, 'get_users_by_dids');
      verifiers = verifiers.map((v: any) => {
        return {
          name: v.name,
          did: v.did
        };
      });
    }

    return verifiers;
  }
}
