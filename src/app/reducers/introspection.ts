import GrpcTypeRegistry from "../../registry/registry";
import {INTROSPECT, INTROSPECT_FAILURE, INTROSPECT_SUCCESS} from "../actions/introspection";
import GrpCurlCommand from "../../models/GrpCurlCommand";
import GrpCurlResponse from "../../models/GrpCurlResponse";

export type IntrospectionState = {
    isLoading?: false,
    errorMessage?: '',
    typeRegistry?: GrpcTypeRegistry,
}

export const defaultState: IntrospectionState = {
    isLoading: false,
    errorMessage: '',
    typeRegistry: new GrpcTypeRegistry(),
};

export default function introspection(state: IntrospectionState = defaultState, action: any) {
    switch (action.type) {
        case INTROSPECT:
            return {
                ...state,
                isLoading: true,
                errorMessage: '',
            };
        case INTROSPECT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errorMessage: '',
                typeRegistry: action.typeRegistry,
            };
        case INTROSPECT_FAILURE:
            const response: GrpCurlResponse = (action as any).response as GrpCurlResponse;
            return {
                ...state,
                isLoading: false,
                errorMessage: response?.getError(),
            };
        default:
            return state;
    }
}