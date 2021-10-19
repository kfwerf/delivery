import GrpCurlCommand, { defaultCommand } from '../../models/GrpCurlCommand';
import { CommandTypes, REQUEST_UPDATE_COMMAND, UpdateCommandPayload } from '../actions/command';

export type CommandState = {
  command: GrpCurlCommand;
};

const defaultState: CommandState = {
  command: defaultCommand,
};

export default function request(state = defaultState, action: CommandTypes): CommandState {
  switch (action.type) {
    case REQUEST_UPDATE_COMMAND: {
      const { command } = action as UpdateCommandPayload;
      return {
        ...state,
        command,
      };
    }
    default:
      return state;
  }
}
