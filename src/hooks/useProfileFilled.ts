import { useRecoilValue } from 'recoil';
import { FullProfileAtom } from 'src/Atoms/Atoms';

const useProfileFilled = () => {
  const profile = useRecoilValue(FullProfileAtom);

  let hasAbout =
    profile.basicDTO && profile.basicDTO.about && profile.basicDTO.about !== '';
  let hasEducation =
    profile.educationDTO &&
    profile.educationDTO.items &&
    profile.educationDTO.items.length > 0;
  let hasExperience =
    profile.experienceDTO &&
    profile.experienceDTO.items &&
    profile.experienceDTO.items.length > 0;

  const filledContent = hasAbout || hasEducation || hasExperience;

  return { profile, filledContent, hasAbout, hasEducation, hasExperience };
};

export default useProfileFilled;
