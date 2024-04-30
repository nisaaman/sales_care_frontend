import {all} from "redux-saga/effects";
import {combineReducers} from "redux";
import * as auth from "../app/modules/Auth/_redux/authRedux";
//import {productsSlice} from "../app/modules/ECommerce/_redux/products/productsSlice";

export const rootReducer = combineReducers({
  auth: auth.reducer
  // products: productsSlice.reducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
