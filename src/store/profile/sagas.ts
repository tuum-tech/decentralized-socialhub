import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { selectSession } from 'src/store/users/selectors';
import { fetchFollowingDIDsApi, fetchFollowerDIDsApi } from './fetchapi';
import { profileSlice } from './reducer';

export function* getFollowingDidsSaga(
  action: ReturnType<typeof profileSlice.actions.getFollowingDids>
): SagaIterator {
  try {
    const session = yield select(selectSession);

    const followings = yield call(fetchFollowingDIDsApi, session.did);
    yield put(
      profileSlice.actions.getFollowingDidsSuccess({
        did: session.did,
        followings
      })
    );
  } catch (error) {
    yield put(profileSlice.actions.getFollowingDidsFailure({ error }));
  }
}

export function* getFollowerDidsSaga(
  action: ReturnType<typeof profileSlice.actions.getFollowerDids>
): SagaIterator {
  try {
    const session = yield select(selectSession);

    const followers = yield call(fetchFollowerDIDsApi, session.did);
    yield put(
      profileSlice.actions.getFollowerDidsSuccess({
        did: session.did,
        followers
      })
    );
  } catch (error) {
    yield put(profileSlice.actions.getFollowerDidsFailure({ error }));
  }
}

// Watchers
function* watchFollowingDids() {
  yield takeLatest(
    profileSlice.actions.getFollowingDids.type,
    getFollowingDidsSaga
  );
}

function* watchFollowerDids() {
  yield takeLatest(
    profileSlice.actions.getFollowerDids.type,
    getFollowerDidsSaga
  );
}

/**
 * Profile Sagas
 */
function* profileSaga() {
  yield all([watchFollowingDids(), watchFollowerDids()]);
}

export default profileSaga;
