import path from 'path';
import { platform } from 'os';
import { remote } from 'electron';
import { rootPath } from 'electron-root-path';

const IS_PROD = process.env.NODE_ENV === 'production';
const root = rootPath;
const { getAppPath } = remote.app;
// FIXME: Figure out how to get filename not null
const isPackaged = require.main.filename && require.main.filename.indexOf('app.asar') !== -1;


const binariesPath = IS_PROD
  ? path.join(path.dirname(getAppPath()), './bin', platform())
  : path.join(path.dirname(getAppPath()), './delivery/src/bin', platform());

export const execPath = path.resolve(path.join(binariesPath, './grpcurl'));
