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
import { getItemsFromData } from 'src/utils/script';

export enum VerificationStatus {
  requested = 'requested',
  verified = 'verified',
  rejected = 'rejected',
  published = 'published'
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

    console.log('===>requests', requests);
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
        data.push({
          idKey: `Education: ${edu.program} at ${edu.institution}`,
          category: 'education',
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
        data.push({
          idKey: `Experience: ${exp.title} at ${exp.institution}`,
          category: 'experience',
          records
        });
      }
      return data;
    }
    return [];
  }

  public async sendRequest(
    fromDid: string,
    toDids: string[],
    verificationData: VerificationData[],
    msg: string
  ) {
    try {
      for (let i = 0; i < toDids.length; i++) {
        for (let j = 0; j < verificationData.length; j++) {
          const { unique_id } = this.get_content_from_verification_data(
            verificationData[j].records
          );
          await TuumTechScriptService.addVerificationRequest(
            fromDid,
            toDids[i],
            verificationData[j],
            msg,
            unique_id
          );
        }
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

  // temporary
  public async removeVerifiableCredential(diddocument: DIDDocument) {
    const didurl = diddocument.getCredentials()[0].id;
    if (didurl) {
      let builder = DIDDocument.Builder.newFromDocument(diddocument);

      // builder.removeCredential(didurl);
      const documentWithCredential = await builder
        .removeCredential(didurl)
        .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);

      let didService = await DidService.getInstance();
      await didService.storeDocument(documentWithCredential);
    }
  }

  private get_content_from_verification_data(records: any[]) {
    let content = {} as any;
    let unique_id = '';

    for (let i = 0; i < records.length; i++) {
      const field = records[i].field;
      const value = records[i].value;
      content[field] = value;
      unique_id += (records[i].field + '_' + records[i].value)
        .replaceAll(' ', '_')
        .toLowerCase();
    }
    return { content, unique_id };
  }

  public async approveCredential(
    v: VerificationRequest,
    approve = true,
    feedbacks = ''
  ) {
    const requester_didUrl = DID.from(v.from_did);
    if (!requester_didUrl) return;

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

    const { content } = this.get_content_from_verification_data(v.records);

    const vc = await vcBuilder
      .expirationDate(
        new Date(
          new Date().getFullYear() + 5,
          new Date().getMonth(),
          new Date().getDate()
        )
      )
      .type(`${v.category[0].toUpperCase() + v.category.slice(1)}Credential`)
      .property(v.category, content)
      .id(DIDURL.from(`${v.from_did}#${v.idKey}`) as DIDURL)
      .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);

    await TuumTechScriptService.updateVerificationRequest(
      approve ? 'approved' : 'rejected',
      v.category,
      v.msg,
      feedbacks,
      vc.toJSON(),
      v.idKey,
      v.from_did,
      v.to_did
    );
  }

  private async removeCredentialIfExist(
    didDocument: DIDDocument,
    v: VerificationRequest
  ) {
    if (didDocument.getCredentialCount() === 0) {
      return;
    }

    const didUrl = DIDURL.from(`${v.from_did}#${v.idKey}`) as DIDURL;
    const existingVerifiableCredential = didDocument.getCredential(didUrl);

    if (existingVerifiableCredential) {
      const didService = await DidService.getInstance();
      const builder = DIDDocument.Builder.newFromDocument(didDocument);
      const updatedDoc = await builder
        .removeCredential(didUrl)
        .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);

      await didService.storeDocument(updatedDoc);
    }
  }

  public async storeNewCredential(v: VerificationRequest) {
    const didService = await DidService.getInstance();
    let didDocument: DIDDocument = await didService.getStoredDocument(
      new DID(v.from_did)
    );

    await this.removeCredentialIfExist(didDocument, v);

    const builder = DIDDocument.Builder.newFromDocument(didDocument);
    const docWithCredential = await builder
      .addCredential(VerifiableCredential.parse(v.credential))
      .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);

    await didService.storeDocument(docWithCredential);

    await TuumTechScriptService.updateVerificationRequest(
      'published',
      v.category,
      v.msg,
      v.feedbacks,
      v.credential,
      v.idKey,
      v.from_did,
      v.to_did
    );
  }

  public async getCredentials(
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

      if (subjectProperties && subjectProperties[type]) {
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
            let issuerDid = JSON.parse(JSON.stringify(vcs[i].issuer));
            if (!issuerDids.includes(issuerDid)) {
              issuerDids.push(issuerDid);
            }
          }
        }
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
