'use strict';
import path from 'path';
import { platform } from 'os';
import { remote } from 'electron';
import { rootPath } from 'electron-root-path';

const IS_PROD = process.env.NODE_ENV === 'production';
const root = rootPath;
const { getAppPath } = remote.app;
const isPackaged =
    process.mainModule.filename.indexOf('app.asar') !== -1;

const binariesPath =
    IS_PROD && isPackaged
        ? path.join(path.dirname(getAppPath()), './bin', platform())
        : path.join(root, './src/bin', platform());


export const execPath = path.resolve(path.join(binariesPath, './grpcurl'));