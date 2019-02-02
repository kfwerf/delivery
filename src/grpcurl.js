import cmd from 'node-cmd';

const grpcurlWrapper = (params) => new Promise((resolve, reject) => {
  try {
    cmd.get(`${__dirname}/bin/grpcurl ${params}`, (err, data, sterr) => {
      resolve(data || err || sterr);
    });
  } catch (e) {
    console.log('Error occured', e);
    reject(e);
  }
});

const grpcurl = {
  help: () => grpcurlWrapper('-help'),
  version: () => grpcurlWrapper('-version'),
  send: ({ body, url, method }) => grpcurlWrapper(`-d ${body} ${url} ${method}`),
  sendEmpty: ({ url, method }) => grpcurlWrapper(`${url} ${method}`),
};

export default grpcurl;
