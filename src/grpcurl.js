import cmd from 'node-cmd';
import { log } from './app';
import { execPath } from './binaries';

const grpcurlWrapper = params => new Promise((resolve, reject) => {
  try {
    log('using grpc', params);
    cmd.get(`${execPath} -plaintext -max-time 5 ${params}`, (err, data, sterr) => {
      log(`${execPath} -plaintext -max-time 5 ${params}`, { err, data, sterr });
      if (sterr || err) {
        return reject(sterr || err);
      }
      return resolve(data);
    });
  } catch (e) {
    log('Error occured', e);
    reject(e);
  }
});

const sendWithBody = ({ body, url, method }) => grpcurlWrapper(`-d '${body}' ${url} ${method}`);
const sendEmpty = ({ url, method }) => grpcurlWrapper(`${url} ${method}`);

const grpcurl = {
  help: () => grpcurlWrapper('-help'),
  version: () => grpcurlWrapper('-version'),
  send: ({ body, url, method }) => {
    const hasBody = body && body.length > 3;
    if (hasBody) {
      return sendWithBody({ body, url, method });
    }
    return sendEmpty({ url, method });
  },
  list: url => grpcurlWrapper(`${url} list`),
  describe: (url, method) => grpcurlWrapper(`${url} describe ${method}`),
};

export default grpcurl;
