import GrpcTypeRegistry from "../../registry/registry";
import {INTROSPECT, INTROSPECT_FAILURE, INTROSPECT_SUCCESS} from "../actions/introspection";

export const defaultState = {
    isLoading: false,
    errorMessage: '',
    typeRegistry: new GrpcTypeRegistry(),
};

export default function introspection(state = defaultState, action: any) {
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
            return {
                ...state,
                isLoading: false,
                errorMessage: action.errorMessage,
            };
        default:
            return state;
    }
}