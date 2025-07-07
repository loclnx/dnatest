import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "../features/userSlice.js";

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export default rootReducer;
