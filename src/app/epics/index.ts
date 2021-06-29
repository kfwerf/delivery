import {ActionsObservable, combineEpics, ofType} from "redux-observable";
import {interval, of} from "rxjs";
import {
    catchError, delay, filter,
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
    INTROSPECT_FAILURE,
    INTROSPECT_SUCCESS,
    introspection,
    introspectionFailure, IntrospectionPayload,
    introspectionSuccess
} from "../actions/introspection";
import introspectionService from "../services/introspection";
import GrpcTypeRegistry from "../../registry/registry";
import {
    REQUEST_SEND, REQUEST_SEND_FAILURE, REQUEST_SEND_SUCCESS, REQUEST_UPDATE_URL,
    sendRequestFailure, SendRequestPayload,
    sendRequestSuccess, updateBody,
    UpdateUrlPayload, updateUrls
} from "../actions/request";
import { send } from "../services/send";
import GrpCurlResponse from "../../models/GrpCurlResponse";

import GrpCurlCommand from "../../models/GrpCurlCommand";
import {TOAST_ADD, addToast, addedToast, ToastPayload} from "../actions/toast";
import toastManager from "../services/toast";
import {
    ProgressPayload, updateProgress
} from "../actions/progress";
import persistenceRegistry, {PersistenceRegistry} from "../persistency/PersistenceRegistry";
import { defaultCommand } from "../../models/GrpCurlCommand";

const MIN_URL_LENGTH = 3;
const filterMinLengthUrl = (action$: ActionsObservable<any>) =>
    action$.ofType(REQUEST_UPDATE_URL).pipe(
        filter((action: UpdateUrlPayload) => action?.url?.length > MIN_URL_LENGTH),
        map((action: UpdateUrlPayload)=> action.url));

const updateUrlIntrospectionEpic = (action$: ActionsObservable<any>) =>
    filterMinLengthUrl(action$).pipe(switchMap((url) => {
        return of(introspection(defaultCommand, url));
    }));

const updateUrlPersistenceEpic = (action$: ActionsObservable<any>) =>
    filterMinLengthUrl(action$).pipe(
        switchMap((url) => {
            // TODO: Maybe this needs to happen elsewhere?
            persistenceRegistry.setUrl(PersistenceRegistry.newUrlEntry(url));
            const urls = persistenceRegistry.getUrlsAsStringList();
            return of(updateUrls(urls));
        })
    );
// TODO: Add updates for body/method via this way

const RETRY_ATTEMPTS = 3;
const introspectionEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(INTROSPECT).pipe(
        throttleTime(300),
        switchMap((action: IntrospectionPayload) => {
            const { url, command } = action;
            return introspectionService(command, url).pipe(
                    retry(RETRY_ATTEMPTS),
                    map((data) => {
                        const payload: GrpcTypeRegistry = data as GrpcTypeRegistry;
                        return introspectionSuccess(url, payload);
                    }),
                    catchError((response: GrpCurlResponse) => of(introspectionFailure(response))),
                )
            },
        ));

const sendRequestEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(REQUEST_SEND).pipe(
        switchMap((action: SendRequestPayload) => {
            const { url, method, body } = action;
            return send(url, method, body).pipe(
                retry(RETRY_ATTEMPTS),
                map((response: GrpCurlResponse) => sendRequestSuccess(response)),
                catchError((error: GrpCurlResponse) => of(sendRequestFailure(error)))
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


export const rootEpic = combineEpics(
    updateUrlIntrospectionEpic,
    updateUrlPersistenceEpic,
    introspectionEpic,
    sendRequestEpic,
    sendRequestFailEpic,
    addToastEpic,
    startProgressEpic,
    stopProgressEpic
);