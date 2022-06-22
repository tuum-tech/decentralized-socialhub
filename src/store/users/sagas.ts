import { all, call, put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { Actions } from './constants';
import {
  getUsersByDid as getUsersByDidAction,
  getUsersByDidFailure,
  getUsersByDidSuccess
} from './actions';
import { fetchUsersByDIDsApi } from './fetchapi';

export function* getUsersByDidSaga(
  action: ReturnType<typeof getUsersByDidAction>
): SagaIterator {
  try {
    const users = yield call(
      fetchUsersByDIDsApi,
      action.payLoad.dids,
      action.payLoad.limit,
      action.payLoad.offset
    );
    yield put(getUsersByDidSuccess({ users }));
  } catch (error) {
    yield put(getUsersByDidFailure({ error }));
  }
}

// Watchers
function* watchUsersByDid() {
  yield takeLatest(Actions.GET_USERS_BY_DID, getUsersByDidSaga);
}

/**
 * Users Sagas
 */
function* userSaga() {
  yield all([watchUsersByDid()]);
}

export default userSaga;
