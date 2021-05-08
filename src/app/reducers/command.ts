import {
    REQUEST_UPDATE_COMMAND,
} from "../actions/request";
import GrpCurlCommand, {defaultCommand} from "../../models/GrpCurlCommand";

const defaultState = {
    command: defaultCommand,
};

export default function request(state = defaultState, action: any) {
    switch (action.type) {
        case REQUEST_UPDATE_COMMAND: {
            const command: GrpCurlCommand = action.command;
            return {
                ...state,
                command,
            };
        }
        default:
            return state;
    }
}