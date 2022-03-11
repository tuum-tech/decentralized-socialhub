import { selector } from 'recoil';
import { FullProfileAtom } from './Atoms';

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
