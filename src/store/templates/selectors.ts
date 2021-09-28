import { createSelector } from 'reselect';
import { SubState } from './types';

const templateState = (state: any): SubState => state['template'];

const makeSelectMyTemplates = () =>
  createSelector(templateState, (state: SubState) => state.myTemplates);

export { templateState, makeSelectMyTemplates };
