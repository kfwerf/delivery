import GrpcRegistry from "../../registry/registry";

export const INTROSPECT = 'INTROSPECT';
export const INTROSPECT_SUCCESS = 'INTROSPECT_SUCCESS';
export const INTROSPECT_FAILURE = 'INTROSPECT_FAILURE';

export const introspection = (url: string) => ({
    type: INTROSPECT,
    url,
});

export const introspectionSuccess = (url: string, typeRegistry: GrpcRegistry) => ({
    type: INTROSPECT_SUCCESS,
    url,
    typeRegistry,
});

export const introspectionFailure = (url: string, errorMessage: string) => ({
    type: INTROSPECT_FAILURE,
    url,
    errorMessage,
});