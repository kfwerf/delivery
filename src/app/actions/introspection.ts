import GrpcRegistry from '../../registry/registry';
import GrpCurlResponse from '../../models/GrpCurlResponse';
import GrpCurlCommand from '../../models/GrpCurlCommand';
import GrpcTypeRegistry from '../../registry/registry';

export const INTROSPECT = 'INTROSPECT';
export const INTROSPECT_SUCCESS = 'INTROSPECT_SUCCESS';
export const INTROSPECT_FAILURE = 'INTROSPECT_FAILURE';

export type IntrospectionPayload = {
  type: string;
  url: string;
  command: GrpCurlCommand;
};

export type IntrospectionSuccessPayload = {
  type: string;
  url: string;
  typeRegistry: GrpcTypeRegistry;
};

export type IntrospectionFailurePayload = {
  type: string;
  response: GrpCurlResponse;
};

export type IntrospectionTypes = IntrospectionPayload | IntrospectionSuccessPayload | IntrospectionFailurePayload;

export const introspection = (command: GrpCurlCommand, url: string): IntrospectionPayload => ({
  type: INTROSPECT,
  url,
  command,
});

export const introspectionSuccess = (url: string, typeRegistry: GrpcRegistry): IntrospectionSuccessPayload => ({
  type: INTROSPECT_SUCCESS,
  url,
  typeRegistry,
});

export const introspectionFailure = (response: GrpCurlResponse): IntrospectionFailurePayload => ({
  type: INTROSPECT_FAILURE,
  response,
});
