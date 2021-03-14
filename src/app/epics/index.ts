import {ActionsObservable, combineEpics, ofType} from "redux-observable";
import {of} from "rxjs";
import {catchError, map, retry, switchMap} from "rxjs/operators";

import { INTROSPECT, introspectionFailure, introspectionSuccess } from "../actions/introspection";
import introspection from "../services/introspection";
import GrpcTypeRegistry from "../../registry/registry";
import {REQUEST_SEND, sendRequestFailure, sendRequestSuccess} from "../actions/request";
import send from "../services/send";
import GrpCurlResponse from "../../models/GrpCurlResponse";
import {mergeMap} from "rxjs-compat/operator/mergeMap";
import {Action} from "rxjs/internal/scheduler/Action";

const RETRY_ATTEMPTS = 3;
const introspectionEpic = (action$: any) =>
    action$.ofType(INTROSPECT).pipe(
        switchMap((action) => {
            const url: string = (action as any).url;
            return introspection(url).pipe(
                    retry(RETRY_ATTEMPTS),
                    map((data) => {
                        const payload: GrpcTypeRegistry = data as GrpcTypeRegistry;
                        return introspectionSuccess(url, payload);
                    }),
                    catchError((errorMessage) => of(introspectionFailure(url, errorMessage))),
                )
            },
        ));

const sendEpic = (action$: ActionsObservable<any>) => action$.pipe(
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

export const rootEpic = combineEpics(introspectionEpic, sendEpic);