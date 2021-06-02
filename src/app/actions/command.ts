import GrpCurlCommand from "../../models/GrpCurlCommand";
import {
    REQUEST_UPDATE_COMMAND
} from "./request";

export const updateCommand = (command: GrpCurlCommand) => ({
    type: REQUEST_UPDATE_COMMAND,
    command,
})