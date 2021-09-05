import {
  TuumTechScriptService,
  UserVaultScriptService
} from './script.service';

export enum VerificationStatus {
  requested = 'requested',
  verified = 'verified',
  rejected = 'rejected'
}

export class VerificationService {
  public async generatePersonalInfoVerificaiotnData() {
    const firstName = '';
    const lastName = '';
    const location = '';
    const email = '';

    const data = {
      category: 'Personal Info',
      records: [
        {
          field: 'lastName',
          value: lastName
        },
        {
          field: 'firstName',
          value: firstName
        },
        {
          field: 'location',
          value: location
        },
        {
          field: 'email',
          value: email
        }
      ]
    };

    return data;
  }

  public async generateEducationVerificationData() {
    const start = '';
    const end = '';
    const institution = '';
    const program = '';

    const data = {
      category: 'Education Info',
      records: [
        {
          field: 'start',
          value: start
        },
        {
          field: 'end',
          value: end
        },
        {
          field: 'institution',
          value: institution
        },
        {
          field: 'program',
          value: program
        }
      ]
    };

    return data;
  }

  public async generateExperienceVerificaitonData() {
    const start = '';
    const end = '';
    const title = '';
    const organization = '';

    const data = {
      category: 'Education Info',
      records: [
        {
          field: 'start',
          value: start
        },
        {
          field: 'end',
          value: end
        },
        {
          field: 'title',
          value: title
        },
        {
          field: 'organization',
          value: organization
        }
      ]
    };

    return data;
  }
}
