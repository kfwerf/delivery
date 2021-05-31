import {ActionsObservable, combineEpics, ofType} from "redux-observable";
import {of} from "rxjs";
import {catchError, finalize, map, retry, switchMap, throttle, throttleTime} from "rxjs/operators";

import {
    INTROSPECT,
    INTROSPECT_FAILURE,
    introspectionFailure,
    introspectionSuccess
} from "../actions/introspection";
import introspection from "../services/introspection";
import GrpcTypeRegistry from "../../registry/registry";
import {
    REQUEST_SEND, REQUEST_SEND_FAILURE,
    sendRequestFailure,
    sendRequestSuccess
} from "../actions/request";
import { send, command } from "../services/send";
import GrpCurlResponse from "../../models/GrpCurlResponse";
import {mergeMap} from "rxjs-compat/operator/mergeMap";
import {Action} from "rxjs/internal/scheduler/Action";
import GrpCurlCommand from "../../models/GrpCurlCommand";
import {ADD_TOAST, addToast} from "../actions/toast";
import toastManager from "../services/toast";

const RETRY_ATTEMPTS = 3;
const introspectionEpic = (action$: any) =>
    action$.ofType(INTROSPECT).pipe(
        switchMap((action) => {
            const url: string = (action as any).url;
            const command: GrpCurlCommand = (action as any).command;
            return introspection(command, url).pipe(
                    retry(RETRY_ATTEMPTS),
                    map((data) => {
                        const payload: GrpcTypeRegistry = data as GrpcTypeRegistry;
                        return introspectionSuccess(url, payload);
                    }),
                    catchError((response: GrpCurlResponse) => of(introspectionFailure(response))),
                )
            },
        ));

const sendRequestEpic = (action$: ActionsObservable<any>) => action$.pipe(
    ofType(REQUEST_SEND),
    switchMap((action) => {
        const url: string = action.url;
        const method: string = action.method;
        const body: string = action.body;
        return send(url, method, body).pipe(
            retry(RETRY_ATTEMPTS),
            map(data => {
                const response: GrpCurlResponse = data as GrpCurlResponse;
                return sendRequestSuccess(response);
            }),
            catchError((error) => {
                return of(sendRequestFailure(error));
            })
        );
    }));

const sendRequestFailEpic = (action$: ActionsObservable<any>) => action$.pipe(
    ofType(INTROSPECT_FAILURE, REQUEST_SEND_FAILURE),
    switchMap((action) => {
        const response = action.response as GrpCurlResponse;
        const errorMessage = response?.getError()?.split('\n')?.join('<br>');
        return of(addToast('An error has occured', errorMessage, 'error'));
    })
);

const addToastEpic = (action$: ActionsObservable<any>) => action$.pipe(
    ofType(ADD_TOAST),
    throttleTime(300),
    switchMap((action) => {
        const { title, text, toastType: type } = action;
        toastManager.notify(title, text, type);
        // Return success?
        return of({
            type: 'TOAST_YAY'
        });
    }));



export const rootEpic = combineEpics(introspectionEpic, sendRequestEpic, sendRequestFailEpic, addToastEpic);