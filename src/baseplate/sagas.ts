import { all } from 'redux-saga/effects';

import spaceSaga from 'src/store/spaces/sagas';
import userSaga from 'src/store/users/sagas';
import profileSaga from 'src/store/profile/sagas';

export function* rootSaga() {
  yield all([spaceSaga(), userSaga(), profileSaga()]);
}
