import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer as routing } from 'react-router-redux';

import notificationReducer from './modules/notifications';
import uiReducer from './modules/ui';
import fileReducer from './modules/file';
import progressReducer from './modules/progress';

export default function createReducer(asyncReducers) {
  return combineReducers({
    ui: uiReducer,
    files: fileReducer,
    notifications: notificationReducer,
    progress: progressReducer,
    form: formReducer,

    routing,
    ...asyncReducers,
  });
}
