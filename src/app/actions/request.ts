import GrpCurlResponse from "../../models/GrpCurlResponse";
import {GrpcMessageRecord} from "../../models/GrpcMessage";

export const REQUEST_UPDATE_URL = 'REQUEST_UPDATE_URL';
export const REQUEST_UPDATE_URLS = 'REQUEST_UPDATE_URLS';
export const REQUEST_UPDATE_METHOD = 'REQUEST_UPDATE_METHOD';
export const REQUEST_UPDATE_BODY = 'REQUEST_UPDATE_BODY';
export const REQUEST_UPDATE_BODY_SUCCESS = 'REQUEST_UPDATE_BODY_SUCCESS';
export const REQUEST_UPDATE_EXAMPLE = 'REQUEST_UPDATE_EXAMPLE';
export const REQUEST_UPDATE = 'REQUEST_UPDATE';
export const REQUEST_SEND = 'REQUEST_SEND';
export const REQUEST_SEND_SUCCESS = 'REQUEST_SEND_SUCCESS';
export const REQUEST_SEND_FAILURE = 'REQUEST_SEND_FAILURE';

export const REQUEST_UPDATE_COMMAND = 'REQUEST_UPDATE_COMMAND';
export const REQUEST_SEND_COMMAND = 'REQUEST_COMMAND';
export const REQUEST_SEND_COMMAND_SUCCESS = 'REQUEST_COMMAND_SUCCESS';
export const REQUEST_SEND_COMMAND_FAILURE = 'REQUEST_COMMAND_FAILURE';

export type SendRequestPayload = {
    type: string,
    url: string,
    method: string,
    body: string,
};

export type UpdateUrlPayload = {
    type: string,
    url: string,
};

export type UpdateUrlsPayload = {
    type: string,
    urls: string[],
};
export type UpdateMethodPayload = {
    type: string,
    method: string,
};

export type UpdateBodyPayload = {
    type: string,
    body: string,
};

export type UpdateExamplePayload = {
    type: string,
    example: string,
};

export type UpdateRequestPayload = {
    type: string,
    url: string,
    method: string,
    body: string,
    example: string,
}


export const sendRequest = (url: string, method: string, body: string): SendRequestPayload => ({
    type: REQUEST_SEND,
    url,
    method,
    body,
});

export const sendRequestSuccess = (response: GrpCurlResponse) => ({
    type: REQUEST_SEND_SUCCESS,
    response,
});

export const sendRequestFailure = (response: GrpCurlResponse) => ({
    type: REQUEST_SEND_FAILURE,
    response,
});

export const updateUrl = (url: string): UpdateUrlPayload => ({
    type: REQUEST_UPDATE_URL,
    url,
});

export const updateUrls = (urls: string[]): UpdateUrlsPayload => ({
    type: REQUEST_UPDATE_URLS,
    urls,
});

export const updateMethod = (method: string): UpdateMethodPayload => ({
    type: REQUEST_UPDATE_METHOD,
    method,
});

export const updateRequest = (url: string, method: string, example: string, body: string): UpdateRequestPayload => ({
    type: REQUEST_UPDATE,
    url,
    method,
    example,
    body,
});

export const updateBody = (body: string): UpdateBodyPayload => ({
    type: REQUEST_UPDATE_BODY,
    body,
});

export const updateExample = (example: GrpcMessageRecord): UpdateExamplePayload => ({
    type: REQUEST_UPDATE_EXAMPLE,
    example: JSON.stringify(example),
})

export const updateBodySuccess = () => ({
    type: REQUEST_UPDATE_BODY_SUCCESS,
});