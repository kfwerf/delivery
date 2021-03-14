import { combineReducers } from "redux";
import introspection from "./introspection";
import request from "./request";

export const rootReducer = combineReducers({ introspection, request });