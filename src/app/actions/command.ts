import GrpCurlCommand from '../../models/GrpCurlCommand';

export const REQUEST_UPDATE_COMMAND = 'REQUEST_UPDATE_COMMAND';
export const REQUEST_SEND_COMMAND = 'REQUEST_COMMAND';
export const REQUEST_SEND_COMMAND_SUCCESS = 'REQUEST_COMMAND_SUCCESS';
export const REQUEST_SEND_COMMAND_FAILURE = 'REQUEST_COMMAND_FAILURE';

export type UpdateCommandPayload = {
  type: string;
  command: GrpCurlCommand;
};

export type CommandTypes = UpdateCommandPayload;

export const updateCommand = (command: GrpCurlCommand): UpdateCommandPayload => ({
  type: REQUEST_UPDATE_COMMAND,
  command,
});
