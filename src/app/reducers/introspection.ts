import GrpcTypeRegistry from '../../registry/registry';
import {
  INTROSPECT,
  INTROSPECT_FAILURE,
  INTROSPECT_SUCCESS,
  IntrospectionFailurePayload,
  IntrospectionSuccessPayload,
  IntrospectionTypes,
} from '../actions/introspection';
import GrpCurlResponse from '../../models/GrpCurlResponse';

export type IntrospectionState = {
  isLoading: boolean;
  errorMessage: string;
  typeRegistry: GrpcTypeRegistry;
};

export const defaultState: IntrospectionState = {
  isLoading: false,
  errorMessage: '',
  typeRegistry: new GrpcTypeRegistry(),
};

export default function introspection(
  state: IntrospectionState = defaultState,
  action: IntrospectionTypes,
): IntrospectionState {
  switch (action.type) {
    case INTROSPECT:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    case INTROSPECT_SUCCESS:
      const payloadSuccess = action as IntrospectionSuccessPayload;
      return {
        ...state,
        isLoading: false,
        errorMessage: '',
        typeRegistry: payloadSuccess.typeRegistry,
      };
    case INTROSPECT_FAILURE:
      const payloadFailure = action as IntrospectionFailurePayload;
      const response: GrpCurlResponse = payloadFailure.response as GrpCurlResponse;
      return {
        ...state,
        isLoading: false,
        errorMessage: response?.getError(),
      };
    default:
      return state;
  }
}
