import { createSelector } from 'reselect';
import { NameSpace } from './constants';
import { SubState } from './types';

const spaceState = (state: any): SubState => state[NameSpace];

export const selectSpaces = createSelector(spaceState, state => state.spaces);

export const selectSpacesLoading = createSelector(
  spaceState,
  state => state.loading
);
