import { all } from 'redux-saga/effects';

import spaceSaga from 'src/store/spaces/sagas';

export function* rootSaga() {
  yield all([spaceSaga()]);
}
