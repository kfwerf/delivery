import {
    REQUEST_UPDATE_BODY,
    REQUEST_UPDATE_METHOD,
    REQUEST_UPDATE_URL,
    REQUEST_SEND_SUCCESS,
    REQUEST_SEND_FAILURE,
    REQUEST_SEND,
    UpdateUrlPayload,
    REQUEST_UPDATE_URLS,
    UpdateUrlsPayload,
    REQUEST_UPDATE_EXAMPLE,
    UpdateExamplePayload,
    UpdateBodyPayload,
    UpdateMethodPayload, SendRequestPayload,
} from "../actions/request";
import GrpCurlResponse from "../../models/GrpCurlResponse";
import {PROGRESS_UPDATE, ProgressUpdatePayload} from "../actions/progress";
import persistenceRegistry from "../persistency/PersistenceRegistry";

export type RequestState = {
    urls: string[],
    url: string,
    method: string,
    body: string,
    example: string,
    response: GrpCurlResponse,
    isLoading: boolean,
    progressLoading: number,
};

const defaultState: RequestState = {
    urls: persistenceRegistry.getUrlsAsStringList(),
    url: '',
    method: '',
    body: '',
    example: '',
    response: new GrpCurlResponse('', '', ''),
    isLoading: false,
    progressLoading: 0,
};

export default function request(state = defaultState, action: any) {
    switch (action.type) {
        case REQUEST_UPDATE_BODY: {
            const payload: UpdateBodyPayload = action;
            const body = payload.body;
            return {
                ...state,
                body,
            };
        }
        case REQUEST_UPDATE_EXAMPLE: {
            const payload: UpdateExamplePayload = action;
            const example = payload.example;
            return {
                ...state,
                example,
            };
        }
        case REQUEST_UPDATE_METHOD: {
            const payload: UpdateMethodPayload = action;
            const method = payload.method;
            return {
                ...state,
                method,
            };
        }
        case REQUEST_UPDATE_URL: {
            const payload: UpdateUrlPayload = action;
            const url = payload.url;
            return {
                ...state,
                url,
            };
        }
        case REQUEST_UPDATE_URLS: {
            const payload: UpdateUrlsPayload = action;
            const urls = payload.urls;
            return {
                ...state,
                urls,
            };
        }
        case REQUEST_SEND: {
            const { url, method, body }: SendRequestPayload = action;
            return {
                ...state,
                url,
                method,
                body,
                isLoading: true,
                progressLoading: 0,
            };
        }
        case REQUEST_SEND_SUCCESS: {
            const response = action.response;
            return {
                ...state,
                response,
                isLoading: false,
                progressLoading: 0,
            };
        }
        case REQUEST_SEND_FAILURE: {
            const response = action.response;
            return {
                ...state,
                response,
                isLoading: false,
                progressLoading: 0,
            };
        }
        case PROGRESS_UPDATE: {
            const { value: progressLoading }: ProgressUpdatePayload = action;
            return {
                ...state,
                isLoading: false,
                progressLoading,
            };
        }
        default:
            return state;
    }
}