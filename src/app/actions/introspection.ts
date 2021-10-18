import GrpcRegistry from "../../registry/registry";
import GrpCurlResponse from "../../models/GrpCurlResponse";
import GrpCurlCommand from "../../models/GrpCurlCommand";
import GrpcTypeRegistry from "../../registry/registry";

export const INTROSPECT = 'INTROSPECT';
export const INTROSPECT_SUCCESS = 'INTROSPECT_SUCCESS';
export const INTROSPECT_FAILURE = 'INTROSPECT_FAILURE';

export type IntrospectionPayload = {
    type: string,
    url: string,
    command: GrpCurlCommand,
};

export type IntrospectionSuccess = {
    type: string,
    url: string,
    typeRegistry: GrpcTypeRegistry,
}

export const introspection = (command: GrpCurlCommand, url: string): IntrospectionPayload => ({
    type: INTROSPECT,
    url,
    command,
});

export const introspectionSuccess = (url: string, typeRegistry: GrpcRegistry): IntrospectionSuccess => ({
    type: INTROSPECT_SUCCESS,
    url,
    typeRegistry,
});

export const introspectionFailure = (response: GrpCurlResponse) => ({
    type: INTROSPECT_FAILURE,
    response,
});