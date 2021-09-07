export enum VerificationStatus {
  requested = 'requested',
  verified = 'verified',
  rejected = 'rejected'
}

export class VerificationService {
  public retrieveUsersVerificationCategories(
    profile: ProfileDTO,
    session: ISessionItem
  ) {
    const { experienceDTO, educationDTO } = profile;

    const personInfoData: VerificationData[] = this.generatePersonalInfoVerificaiotnData(
      session.name || '',
      session.email || '',
      session.phonNumber || ''
    );

    const educationData: VerificationData[] = this.generateEducationVerificationData(
      educationDTO.items
    );

    const experienceData: VerificationData[] = this.generateExperienceVerificationData(
      experienceDTO.items
    );

    return [...personInfoData, ...educationData, ...experienceData];
  }

  public generatePersonalInfoVerificaiotnData(
    name: string,
    email: string,
    phonNumber: string
  ) {
    const category = 'Personal Info';
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
    if (phonNumber !== '') {
      records.push({
        field: 'phonNumber',
        value: phonNumber
      });
    }

    return [{ category, records }];
  }

  public generateEducationVerificationData(items: EducationItem[]) {
    if (items.length > 0) {
      const data = [];
      const category = 'Education';
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
          category,
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
      const category = 'Experience';
      for (let i = 0; i < items.length; i++) {
        const edu = items[i];
        const records = [];
        if (edu.institution) {
          records.push({
            field: 'institution',
            value: edu.institution
          });
        }
        if (edu.title) {
          records.push({
            field: 'title',
            value: edu.title
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
          category,
          records
        });
      }
      return data;
    }
    return [];
  }
}
