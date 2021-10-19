import {ActionsObservable, combineEpics, StateObservable} from "redux-observable";
import {interval, of} from "rxjs";
import {
    catchError,
    filter,
    map,
    retry,
    switchMap,
    takeWhile,
    tap,
    throttleTime, withLatestFrom
} from "rxjs/operators";

import {
    INTROSPECT,
    INTROSPECT_FAILURE,
    INTROSPECT_SUCCESS,
    introspection,
    introspectionFailure,
    IntrospectionPayload,
    IntrospectionSuccess,
    introspectionSuccess
} from "../actions/introspection";
import introspectionService from "../services/introspection";
import GrpcTypeRegistry from "../../registry/registry";
import {
    REQUEST_SEND,
    REQUEST_SEND_FAILURE,
    REQUEST_SEND_SUCCESS,
    REQUEST_UPDATE_BODY,
    REQUEST_UPDATE_EXAMPLE,
    REQUEST_UPDATE_METHOD,
    REQUEST_UPDATE_URL,
    sendRequestFailure,
    SendRequestPayload,
    sendRequestSuccess,
    updateBody,
    UpdateBodyPayload, updateBodySuccess, updateExample, UpdateExamplePayload,
    updateMethod,
    UpdateMethodPayload,
    UpdateUrlPayload,
    updateUrls
} from "../actions/request";
import {send} from "../services/send";
import GrpCurlResponse from "../../models/GrpCurlResponse";

import {defaultCommand} from "../../models/GrpCurlCommand";
import {addedToast, addToast, TOAST_ADD, ToastPayload} from "../actions/toast";
import toastManager from "../services/toast";
import {ProgressPayload, updateProgress} from "../actions/progress";
import persistenceRegistry, {PersistenceRegistry} from "../persistency/PersistenceRegistry";
import {IntrospectionState} from "../reducers/introspection";
import {RequestState} from "../reducers/request";

const MIN_URL_LENGTH = 3;
const filterMinLengthUrl = (action$: ActionsObservable<any>) =>
    action$.ofType(REQUEST_UPDATE_URL).pipe(
        throttleTime(300),
        filter((action: UpdateUrlPayload) => action?.url?.length > MIN_URL_LENGTH),
        map((action: UpdateUrlPayload)=> action.url));

const updateUrlIntrospectionEpic = (action$: ActionsObservable<any>) =>
    filterMinLengthUrl(action$).pipe(switchMap(
        (url) => of(introspection(defaultCommand, url))));

const updateUrlPersistenceEpic = (action$: ActionsObservable<any>) =>
    filterMinLengthUrl(action$).pipe(
        tap(url => persistenceRegistry.setUrl(PersistenceRegistry.newUrlEntry(url))),
        switchMap(() => of(updateUrls(persistenceRegistry.getUrlsAsStringList()))),
    );

const updateBodyPersistenceEpic = (action$: ActionsObservable<any>, state$: StateObservable<any>) =>
    action$.ofType(REQUEST_UPDATE_BODY).pipe(
        withLatestFrom(state$),
        filter(([action, state], _) => action?.body && action?.body?.length),
        tap(([action, state]) => {
            const payload: UpdateBodyPayload = action;
            const requestState: RequestState = state?.request;
            const { url, method } = requestState;
            const example = JSON.parse(requestState?.example);
            const body = JSON.parse(payload?.body);
            persistenceRegistry.setBody(PersistenceRegistry.newBodyEntry(url, method, example, body));
        }),
        switchMap(() => of(updateBodySuccess())),
    );

const updateExampleAfterMethodChangeEpic = (action$: ActionsObservable<any>, state$: StateObservable<any>) =>
    action$.ofType(REQUEST_UPDATE_METHOD).pipe(
        throttleTime(300),
        withLatestFrom(state$),
        map(([action, state]) => {
            const payload: UpdateMethodPayload = action;
            const introspectionState: IntrospectionState = state?.introspection;
            const method = payload?.method;
            const typeRegistry = introspectionState?.typeRegistry;
            const rpc = typeRegistry?.getRpc(method);
            const requestMethod = rpc?.getRequest();
            const message = typeRegistry?.getMessage(requestMethod);
            return message?.getExample(typeRegistry) || {};
        }),
        switchMap((example) => of(updateExample(example))),
    );

const updateBodyAfterExampleChangeEpic = (action$: ActionsObservable<any>, state$: StateObservable<any>) =>
    action$.ofType(REQUEST_UPDATE_EXAMPLE).pipe(
        throttleTime(300),
        withLatestFrom(state$),
        map(([action, state]) => {
            const payload: UpdateExamplePayload = action;
            const requestState: RequestState = state?.request;
            const url = requestState?.url;
            const method = requestState?.method;
            const example = payload?.example;
            const entry = persistenceRegistry.getBody(url, method, JSON.parse(example));
            const body = entry?.body;
            const hasPersistenceBody = body && body !== example;

            return hasPersistenceBody ? body : '';
        }),
        switchMap((body= '') => of(updateBody(body))),
    );

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
            );
        },
    ));

const introspectionSuccessEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(INTROSPECT_SUCCESS).pipe(
        map((action: IntrospectionSuccess) => {
            const typeRegistry: GrpcTypeRegistry = action?.typeRegistry;
            const firstService = typeRegistry?.listServices()[0];
            const firstRpc = firstService?.getRpcList()[0];
            return firstRpc?.getPath();
        }),
        filter(path => path.length > 0),
        switchMap((path) => of(updateMethod(path))),
    );

const sendRequestEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(REQUEST_SEND).pipe(
        switchMap((action: SendRequestPayload) => {
            const { url, method, body } = action;
            return send(url, method, body).pipe(
                retry(RETRY_ATTEMPTS),
                map((response: GrpCurlResponse) => sendRequestSuccess(response)),
                catchError((error: GrpCurlResponse) => of(sendRequestFailure(error)))
            );
        })
    );

const sendRequestFailEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(INTROSPECT_FAILURE, REQUEST_SEND_FAILURE).pipe(
        switchMap((action) => {
            const response = action.response as GrpCurlResponse;
            const errorMessage = response?.getError()?.split('\n')?.join('<br>');
            return of(addToast('An error has occured', errorMessage, 'error'));
        })
    );

const addToastEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(TOAST_ADD).pipe(
        throttleTime(300),
        switchMap((action: ToastPayload) => {
            const { title, text, toastType: type } = action;
            toastManager.notify(title, text, type);
            // Return success?
            return of(addedToast(title, text, type));
        })
    );

// FIXME: Figure a way to not have to use these top values for the predicate
// FIXME: should probably determine take via payload
let durationMs = 5000;
const intervalMs = 10;
const totalTicks = (durationMs / intervalMs);
const getNextProgress = (index: number = 0) => (index / totalTicks) * 100;
let canTake = false;
const startProgressEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(REQUEST_SEND, INTROSPECT).pipe(
        switchMap((_: ProgressPayload) => {
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

const stopProgressEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(REQUEST_SEND_SUCCESS, REQUEST_SEND_FAILURE, INTROSPECT_SUCCESS, INTROSPECT_FAILURE).pipe(
        switchMap((_: ProgressPayload) => of(updateProgress(0))));


export const rootEpic = combineEpics(
    updateUrlIntrospectionEpic,
    updateUrlPersistenceEpic,
    updateExampleAfterMethodChangeEpic,
    updateBodyAfterExampleChangeEpic,
    updateBodyPersistenceEpic,
    introspectionEpic,
    introspectionSuccessEpic,
    sendRequestEpic,
    sendRequestFailEpic,
    addToastEpic,
    startProgressEpic,
    stopProgressEpic
);