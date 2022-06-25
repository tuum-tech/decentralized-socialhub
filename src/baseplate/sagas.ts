import { all } from 'redux-saga/effects';

import spaceSaga from 'src/store/spaces/sagas';
import userSaga from 'src/store/users/sagas';

export function* rootSaga() {
  yield all([spaceSaga(), userSaga()]);
}
