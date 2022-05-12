import { call, put, takeLatest } from 'redux-saga/effects';
import { Actions } from './constants';
import { fetchSpacesFailure, fetchSpacesSuccess } from './actions';
import { fetchSpacesApi } from './fetchapi';
import { SagaIterator } from 'redux-saga';

export function* getSpacesSaga(): SagaIterator {
  try {
    const spaces = yield call(fetchSpacesApi);
    yield put(fetchSpacesSuccess({ spaces }));
  } catch (error) {
    yield put(fetchSpacesFailure({ error }));
  }
}

/**
 * Space Sagas
 */
function* spaceSaga() {
  yield takeLatest(Actions.FETCH_SPACES, getSpacesSaga);
}

export default spaceSaga;
