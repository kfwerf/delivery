import GrpCurlResponse from "../../models/GrpCurlResponse";

export const REQUEST_UPDATE_URL = 'REQUEST_UPDATE_URL';
export const REQUEST_UPDATE_METHOD = 'REQUEST_UPDATE_METHOD';
export const REQUEST_UPDATE_BODY = 'REQUEST_UPDATE_BODY';
export const REQUEST_SEND = 'REQUEST_SEND';
export const REQUEST_SEND_SUCCESS = 'REQUEST_SEND_SUCCESS';
export const REQUEST_SEND_FAILURE = 'REQUEST_SEND_FAILURE';

export const REQUEST_UPDATE_COMMAND = 'REQUEST_UPDATE_COMMAND';
export const REQUEST_SEND_COMMAND = 'REQUEST_COMMAND';
export const REQUEST_SEND_COMMAND_SUCCESS = 'REQUEST_COMMAND_SUCCESS';
export const REQUEST_SEND_COMMAND_FAILURE = 'REQUEST_COMMAND_FAILURE';

export const sendRequest = (url: string, method: string, body: string) => ({
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

export const updateUrl = (url: string) => ({
    type: REQUEST_UPDATE_URL,
    url,
});

export const updateMethod = (method: string) => ({
    type: REQUEST_UPDATE_METHOD,
    method,
});

export const updateBody = (body: string) => ({
    type: REQUEST_UPDATE_BODY,
    body,
});