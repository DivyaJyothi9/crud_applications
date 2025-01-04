import {combineReducers} from "redux";
import userReducer from "./reducer";

const rootReducer = combineReducers({
    data:userReducer
});

export default rootReducer;