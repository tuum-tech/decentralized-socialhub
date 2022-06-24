import { all, call, put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { getUsersByDid as getUsersByDidAction } from './actions';
import { fetchUsersByDIDsApi } from './fetchapi';
import { usersSlice } from './reducer';

export function* getUsersByDidSaga(
  action: ReturnType<typeof getUsersByDidAction>
): SagaIterator {
  try {
    if (!action.payload.dids || !action.payload.dids.length) {
      yield put(usersSlice.actions.getUsersByDidSuccess({ users: [] }));
    } else {
      const users = yield call(
        fetchUsersByDIDsApi,
        action.payload.dids,
        action.payload.limit,
        action.payload.offset
      );
      yield put(usersSlice.actions.getUsersByDidSuccess({ users }));
    }
  } catch (error) {
    yield put(usersSlice.actions.getUsersByDidFailure({ error }));
  }
}

// Watchers
function* watchUsersByDid() {
  yield takeLatest(usersSlice.actions.getUsersByDid.type, getUsersByDidSaga);
}

/**
 * Users Sagas
 */
function* userSaga() {
  yield all([watchUsersByDid()]);
}

export default userSaga;
