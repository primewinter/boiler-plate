import { combineReducers } from 'redux';
import user from './user_reducer';
// import comments from './comment_reducer';

const rootReducer = combineReducers({
    user,
    // comments
})

export default rootReducer;