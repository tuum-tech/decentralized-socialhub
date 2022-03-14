import { selector } from 'recoil';
import { FullProfileAtom } from './Atoms';

export const EducationSelector = selector<EducationDTO>({
  key: 'Education',
  get: ({ get }) => {
    const fullProfile = get(FullProfileAtom);
    return fullProfile.educationDTO;
  },
  set: ({ get, set }, newEducationValue) => {
    let fullProfile = JSON.parse(JSON.stringify(get(FullProfileAtom)));
    fullProfile.experienceDTO = newEducationValue as ExperienceDTO;
    set(FullProfileAtom, fullProfile);
  }
});

export const EducationSortedSelector = selector<EducationDTO>({
  key: 'EducationSorted',
  get: ({ get }) => {
    let education = get(EducationSelector);
    let sorted = JSON.parse(JSON.stringify(education));
    sorted.items.sort(
      (a: any, b: any) =>
        new Date(b.start).getTime() - new Date(a.start).getTime()
    );
    return sorted;
  }
});

export const ExperienceSelector = selector<ExperienceDTO>({
  key: 'Experience',
  get: ({ get }) => {
    const fullProfile = get(FullProfileAtom);
    return fullProfile.experienceDTO;
  },
  set: ({ get, set }, newExperienceValue) => {
    let fullProfile = JSON.parse(JSON.stringify(get(FullProfileAtom)));
    fullProfile.experienceDTO = newExperienceValue as ExperienceDTO;
    set(FullProfileAtom, fullProfile);
  }
});

export const ExperienceSortedSelector = selector<ExperienceDTO>({
  key: 'ExperienceSorted',
  get: ({ get }) => {
    let experience = get(ExperienceSelector);
    let sorted = JSON.parse(JSON.stringify(experience));
    sorted.items.sort(
      (a: any, b: any) =>
        new Date(b.start).getTime() - new Date(a.start).getTime()
    );
    return sorted;
  }
});
