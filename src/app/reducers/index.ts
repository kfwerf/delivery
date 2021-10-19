import { combineReducers } from 'redux';
import introspection from './introspection';
import request from './request';
import command from './command';

const reducers = { introspection, request, command };
export const rootReducer = combineReducers(reducers);
