import { combineReducers } from "redux";
import introspection from "./introspection";
import request from "./request";
import command from "./command";

export const rootReducer = combineReducers({ introspection, request, command });