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
