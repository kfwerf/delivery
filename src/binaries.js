import path from 'path';
import { platform } from 'os';
import { remote } from 'electron';

const IS_PROD = process.env.NODE_ENV === 'production';
const { getAppPath } = remote.app;

const root = IS_PROD ? path.dirname(getAppPath()) : path.join(path.dirname(getAppPath()), 'delivery/src');

const grpcCurlPath = path.join(root, 'bin', platform(), 'grpcurl');

export const execPath = path.resolve(grpcCurlPath);

export const basePath = path.resolve(root);
