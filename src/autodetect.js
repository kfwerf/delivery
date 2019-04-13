import grpcurl from './grpcurl';

function matchSafe(string, regex) {
  return (string.match && string.match(regex)) || [];
}

function isPrimitive(str) {
  return str.indexOf('.') === -1;
}

function fixType(type) {
  return type.startsWith('.') ? type.slice(1) : type;
}

function extractMethods(serviceWithMethods) {
  const servicePath = matchSafe(serviceWithMethods, /.+ is a service:/gm).join('').replace(/ is a service:/, '');
  const serviceName = servicePath.split('.').slice(-1).join('');
  const rpcList = matchSafe(serviceWithMethods, /rpc .+/gm);
  const methods = rpcList.map((rpcRaw) => {
    // const dependencies = rpcRaw.match(/[.][a-zA-Z[0-9.]*/gm);
    const [request, response] = matchSafe(rpcRaw, /\(([^\)]+)\)/gm).map(args => args.match(/[.][.a-zA-Z0-9]+/g).join(''));
    const name = matchSafe(rpcRaw, /rpc [a-zA-Z0-9]+/).join('').replace(/rpc /gm, '');
    const path = `${servicePath}/${name}`;
    return {
      raw: rpcRaw,
      type: 'rpc',
      serviceName,
      servicePath,
      name,
      path,
      request: fixType(request),
      response: fixType(response),
    };
  });
  return {
    raw: serviceWithMethods,
    type: 'service',
    name: serviceName,
    path: servicePath,
    methods,
  };
}

function extractMessage(message) {
  if (!message) {
    return {};
  }
  const path = matchSafe(message, /.+ is a message:/gm).join('').replace(/ is a message:/, '');
  const name = path.split('.').slice(-1).join('');
  const props = matchSafe(message, /[a-zA-Z0-9._]+ [a-zA-Z0-9._]+ = [0-9]/gi).map((prop) => {
    const [type, key] = prop.split(' ');
    const primitive = isPrimitive(type);
    return { type: fixType(type), key, primitive };
  });

  return {
    raw: message,
    type: 'message',
    name,
    path,
    props,
  };
}

function getMessages(results, url, messages) {
  return Promise.all(
    messages.map(message => grpcurl.describe(url, message)),
  ).then((messagesDescribed) => {
    const messagesParsed = messagesDescribed
      .map(messageDescribed => extractMessage(messageDescribed));

    const newResults = results.concat(messagesParsed);

    const additionalDependencies = Object.keys(messagesParsed
      .map(message => message.props.filter(prop => !prop.primitive))
      .reduce((a, b) => a.concat(b), [])
      .map(item => ({ [item.type]: true }))
      .reduce((a, b) => Object.assign(a, b), {}))
      .filter(dependency => !newResults.filter(message => message.path === dependency).length);

    if (additionalDependencies.length) {
      return getMessages(newResults, url, additionalDependencies);
    }
    // resolve
    return newResults;
  });
}

function createPrimitive(type) {
  switch (type) {
    case 'string':
      return '';
    case 'int32':
    case 'int64':
      return 0;
    case 'bool':
      return true;
    default:
      console.log('unknown type', type);
      return null;
  }
}

function createType(type, newMessages) {
  if (isPrimitive(type)) {
    return createPrimitive(type);
  }
  return newMessages[type] && newMessages[type].example;
}

function createExamples(service, messages) {
  // Reverse so that the last dependencies added are first up
  const newMessages = {}; // Need to push in after every update
  messages.reverse().forEach((message) => {
    const example = message.props
      .map(({ type, key }) => ({
        [key]: createType(type, newMessages),
      })).reduce((a, b) => Object.assign(a, b), {});
    newMessages[message.path] = Object.assign(message, {
      example,
    });
  });

  const newMethods = service.methods.map(method => Object.assign(method, {
    example: newMessages[method.request].example,
  }));
  return Object.assign(service, { methods: newMethods });
}

function setStorage(items) {
  localStorage.setItem('autodetecthistory', JSON.stringify(items));
}

function getStorage() {
  try {
    return JSON.parse(localStorage.getItem('autodetecthistory')) || {};
  } catch (_) {
    return {};
  }
}

const history = {};
const setHistory = (url, data) => {
  history[url] = data;
  setStorage(history);
};

const isCached = (url) => {
  return true; // FIXME
  const cooldown = 300000; // 30 mins
  const now = new Date().getTime();
  if (history[url] && now - history[url].lastCreated < cooldown) {
    console.log('waiting with listing', now - history[url].lastCreated);
    return true;
  }
  return false;
};

export default function detect(url, ignoreCooldown) {
  return new Promise((resolve, reject) => {
    let result = { url };
    if (isCached(url, ignoreCooldown)) {
      console.log('Using cache', history[url]);
      return resolve(history[url]);
    }

    grpcurl.list(url)
      .then((rawServices) => {
        const services = rawServices.split('\n').map(item => item.trim()).filter(item => item.length);
        result = Object.assign({ rawServices, services }, result);
        Promise.all(
          services.map(service => grpcurl.describe(url, service)),
        ).then((servicesDescribed) => {
          const servicesParsed = servicesDescribed
            .map(serviceDescribed => extractMethods(serviceDescribed));
          const rawMessages = servicesParsed
            .map(service => service.methods
              .map(method => method.request)
              .reduce((a, b) => a.concat(b), []))
            .reduce((a, b) => a.concat(b), []);
          result = Object.assign({ servicesDescribed, servicesParsed, rawMessages }, result);
          getMessages([], url, rawMessages).then((messagesParsed) => {
            const servicesWithExample = servicesParsed
              .map(service => createExamples(service, messagesParsed));
            result = Object.assign({
              messagesParsed,
              servicesWithExample,
              lastCreated: new Date().getTime(),
            }, result);
            history[url] = result;

            setHistory(url, result);
            resolve(result);
          }).catch(e => reject(Object.assign(result, {
            error: true,
            cause: `${e}`,
          })));
        }).catch(e => reject(Object.assign(result, {
          error: true,
          cause: `${e}`,
        })));
      }).catch(e => reject(Object.assign(result, {
        error: true,
        cause: `${e}`,
      })));
  });
}

const stored = getStorage();
Object.keys(stored).forEach((key) => {
  const item = stored[key];
  history[key] = item;
});
