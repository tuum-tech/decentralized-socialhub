import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { Actions } from './constants';
import {
  fetchSpacesFailure,
  fetchSpacesSuccess,
  updateSpace as updateSpaceAction,
  updateSpaceFailure,
  updateSpaceSuccess,
  removeSpace as removeSpaceAction,
  removeSpaceSuccess,
  removeSpaceFailure
} from './actions';
import { fetchSpacesApi, removeSpaceApi, updateSpaceApi } from './fetchapi';
import { SagaIterator } from 'redux-saga';
import { selectSession } from '../users/selectors';
import { SpaceService } from 'src/services/space.service';

export function* getSpacesSaga(): SagaIterator {
  try {
    const spaces = yield call(fetchSpacesApi);
    yield put(fetchSpacesSuccess({ spaces }));
  } catch (error) {
    yield put(fetchSpacesFailure({ error }));
  }
}

export function* updateSpaceSaga(
  action: ReturnType<typeof updateSpaceAction>
): SagaIterator {
  try {
    const session = yield select(selectSession);
    const space = yield call(
      updateSpaceApi,
      session,
      action.payLoad.space,
      action.payLoad.notify
    );
    yield put(updateSpaceSuccess({ space }));
  } catch (error) {
    yield put(updateSpaceFailure({ error }));
  }
}

export function* removeSpaceSaga(
  action: ReturnType<typeof removeSpaceAction>
): SagaIterator {
  try {
    const session = yield select(selectSession);
    yield call(removeSpaceApi, session, action.payLoad.space);
    // remove all posts created for the space
    const posts = yield call(
      SpaceService.getPostList,
      action.payLoad.space.guid
    );
    yield all(posts.map((post: any) => call(SpaceService.removePost, post)));
    yield put(removeSpaceSuccess({ space: action.payLoad.space }));
    yield put(push('/spaces/list'));
  } catch (error) {
    yield put(removeSpaceFailure({ error }));
  }
}

// Watchers
function* watchGetSpaces() {
  yield takeLatest(Actions.FETCH_SPACES, getSpacesSaga);
}

function* watchUpdateSpace() {
  yield takeLatest(Actions.UPDATE_SPACE, updateSpaceSaga);
}

function* watchRemoveSpace() {
  yield takeLatest(Actions.REMOVE_SPACE, removeSpaceSaga);
}

/**
 * Space Sagas
 */
function* spaceSaga() {
  yield all([watchGetSpaces(), watchUpdateSpace(), watchRemoveSpace()]);
}

export default spaceSaga;
