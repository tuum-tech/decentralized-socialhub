import { profileAdapter } from './reducer';

const profileState = (state: any) => state['profile'];

export const {
  selectById: selectProfileById,
  selectIds: selectProfileIds,
  selectEntities: selectProfileEntities,
  selectAll: selectAllProfiles,
  selectTotal: selectTotalProfiles
} = profileAdapter.getSelectors((state: any) => state.profile);

export { profileState };
