import path from 'path';
import { platform } from 'os';
import { remote } from 'electron';

const IS_PROD = process.env.NODE_ENV === 'production';
const { getAppPath } = remote.app;

const binariesPath = IS_PROD
  ? path.join(path.dirname(getAppPath()), './bin', platform())
  : path.join(path.dirname(getAppPath()), './delivery/src/bin', platform());

export const execPath = path.resolve(path.join(binariesPath, './grpcurl'));
