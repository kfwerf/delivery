import {ActionsObservable, combineEpics, ofType} from "redux-observable";
import {interval, of} from "rxjs";
import {
    catchError, delay,
    finalize,
    map,
    retry,
    switchMap,
    takeWhile,
    throttle,
    throttleTime
} from "rxjs/operators";

import {
    INTROSPECT,
    INTROSPECT_FAILURE, INTROSPECT_SUCCESS,
    introspectionFailure,
    introspectionSuccess
} from "../actions/introspection";
import introspection from "../services/introspection";
import GrpcTypeRegistry from "../../registry/registry";
import {
    REQUEST_SEND, REQUEST_SEND_FAILURE, REQUEST_SEND_SUCCESS,
    sendRequestFailure,
    sendRequestSuccess
} from "../actions/request";
import { send } from "../services/send";
import GrpCurlResponse from "../../models/GrpCurlResponse";

import GrpCurlCommand from "../../models/GrpCurlCommand";
import {TOAST_ADD, addToast, addedToast, ToastPayload} from "../actions/toast";
import toastManager from "../services/toast";
import {
    ProgressPayload, updateProgress
} from "../actions/progress";

const RETRY_ATTEMPTS = 3;
const introspectionEpic = (action$: any) =>
    action$.ofType(INTROSPECT).pipe(
        throttleTime(300),
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
    ofType(TOAST_ADD),
    throttleTime(300),
    switchMap((action: ToastPayload) => {
        const { title, text, toastType: type } = action;
        toastManager.notify(title, text, type);
        // Return success?
        return of(addedToast(title, text, type));
    }));

// FIXME: Figure a way to not have to use these top values for the predicate
// FIXME: should probably determine take via payload
let durationMs = 5000;
const intervalMs = 10;
const totalTicks = (durationMs / intervalMs);
const getNextProgress = (index: number = 0) => (index / totalTicks) * 100;
let canTake = false;
const startProgressEpic = (action$: ActionsObservable<any>) => action$.pipe(
    ofType(REQUEST_SEND, INTROSPECT),
    switchMap((action: ProgressPayload) => {
        canTake = true;
        return interval(intervalMs).pipe(
            takeWhile(() => canTake),
            map((value, index) => {
                if (index > totalTicks) {
                    canTake = false;
                }
                return updateProgress(getNextProgress(index));
            })
        );
    }));

const stopProgressEpic = (action$: ActionsObservable<any>) => action$.pipe(
    ofType(REQUEST_SEND_SUCCESS, REQUEST_SEND_FAILURE, INTROSPECT_SUCCESS, INTROSPECT_FAILURE),
    switchMap((action: ProgressPayload) => {
        canTake = false;
        // Return success?
        return of(updateProgress(0));
    }));



export const rootEpic = combineEpics(introspectionEpic, sendRequestEpic, sendRequestFailEpic, addToastEpic, startProgressEpic, stopProgressEpic);