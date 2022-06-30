import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { selectSession } from 'src/store/users/selectors';
import {
  fetchFollowingDIDsApi,
  fetchFollowerDIDsApi,
  fetchFullProfile
} from './fetchapi';
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

export function* getFullProfileSaga(
  action: ReturnType<typeof profileSlice.actions.getFullProfile>
): SagaIterator {
  try {
    const profileDTO = yield call(
      fetchFullProfile,
      action.payload.did,
      action.payload.userSession
    );
    yield put(
      profileSlice.actions.getFullProfileSuccess({
        did: action.payload.did,
        profileDTO
      })
    );
  } catch (error) {
    yield put(profileSlice.actions.getFullProfileFailure({ error }));
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

function* watchFullProfile() {
  yield takeLatest(
    profileSlice.actions.getFullProfile.type,
    getFullProfileSaga
  );
}

/**
 * Profile Sagas
 */
function* profileSaga() {
  yield all([watchFollowingDids(), watchFollowerDids(), watchFullProfile()]);
}

export default profileSaga;
