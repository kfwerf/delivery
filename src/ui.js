import _ from 'lodash/core';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/shell/shell';
import codeMirror from 'codemirror';
import { js } from 'js-beautify';
import jQuery from 'jquery';
import 'selectize';

import grpcurl from './grpcurl';
import detect, { getLogs } from './autodetect';
import { codeMirrorConfig, setMethod, methodEvent, stateEvent, getMethod, getState, setState, getId, getUrls, setMethods, setBody, dispatchMethodCacheChanged, logsEvent } from './app';

// Input
const root = document;
const inputFields = {
  autodetect: root.querySelector('button.autodetect'),
  url: jQuery('.url').selectize({
    create: true,
    createFilter: url => url.length > 3,
    sortField: 'text',
    placeholder: 'localhost:443',
  })[0].selectize,
  method: jQuery('.method').selectize({
    create: true,
    createFilter: method => method.length > 3,
    sortField: 'text',
    placeholder: 'packagename.serviceName/Method',
  })[0].selectize,
  body_type: root.querySelector('.type'),
  body: codeMirror.fromTextArea(
    root.querySelector('.body'),
    _.defaults(codeMirrorConfig, {
      mode: 'javascript',
    })),
  response: codeMirror.fromTextArea(
    root.querySelector('.response'),
    _.defaults(codeMirrorConfig, {
      mode: 'shell',
      readOnly: true,
    })),
  logs: codeMirror.fromTextArea(
    root.querySelector('.logs'),
    _.defaults(codeMirrorConfig, {
      mode: 'shell',
      readOnly: true,
    })),
  send: root.querySelector('.send'),
  reset: root.querySelector('.reset'),
  logsBtn: root.querySelector('.btn-logs'),
};

const methodLoader = root.querySelector('.loading-method');
const methodContainer = root.querySelector('.method-group .selectize-control');

const logsContainer = root.querySelector('.logs-group');

function hasJson(body, inverse = true) {
  try {
    if (inverse) {
      JSON.stringify(JSON.parse(body));
    } else {
      JSON.parse(JSON.stringify(body));
    }
    return true;
  } catch (e) { /* ignored */ }
  return false;
}

function onAutodetect(url) {
  return detect(url).then((results) => {
    return results;
  }).catch(err => inputFields.response.setValue(JSON.stringify(err) + ''));
}

function onUrlChange(url) {
  setState({
    url,
  });
  methodContainer.classList.add('loading');
  methodLoader.classList.remove('hidden');
  onAutodetect(url).then((results) => {
    methodContainer.classList.remove('loading');
    methodLoader.classList.add('hidden');
    if (results && results.servicesWithExample) {
      results.servicesWithExample.forEach((service) => {
        const methods = service.methods.map(method => _.defaults({
          url,
          service,
        }, method));
        setMethods(methods);
      });
    } else {
      dispatchMethodCacheChanged();
    }
  }).catch(() => {
    methodContainer.classList.remove('loading');
    methodLoader.classList.add('hidden');
  });
}

function onMethodChange(path) {
  const url = inputFields.url.getValue();
  const method = getMethod(path, url);
  if (method) {
    inputFields.body.setValue(js(JSON.stringify(method.body || method.example)));
  } else {
    setMethod({
      url,
      service: {},
      example: '',
      path: inputFields.method.getValue(),
    });
    inputFields.body.setValue(js(''));
  }
  setState({
    url,
    method: inputFields.method.getValue(),
  });
}

function onBodyChange(body) {
  const bodyIsJson = hasJson(body.getValue());
  if (bodyIsJson) {
    inputFields.body_type.innerText = 'application/json';
  } else {
    inputFields.body_type.innerText = 'text';
  }
  const url = inputFields.url.getValue();
  const path = inputFields.method.getValue();
  setBody(path, url, body.getValue());
}

function onSend(e) {
  e.preventDefault();
  const url = inputFields.url.getValue();
  const method = inputFields.method.getValue();
  let body = inputFields.body.getValue();
  try {
    body = JSON.stringify(JSON.parse(body));
  } catch (ignored) { /* ignored */ }
  setState({
    id: getId(),
    url,
    method: inputFields.method.getValue(),
    body,
  });
  grpcurl.send({ url, method, body }).then(res => {
    inputFields.response.setValue(res + '');
  }).catch((error) => {
    inputFields.response.setValue(error + '');
  })
}

function onReset(e) {
  e.preventDefault();
  const url = inputFields.url.getValue();
  const path = inputFields.method.getValue();
  setBody(path, url, null);
  dispatchMethodCacheChanged();
}

function onMethodCacheUpdated(e) {
  const newMethodCache = e.detail.methods;
  const state = getState();
  inputFields.method.clear(true);
  inputFields.method.clearOptions();

  // url
  const activeUrl = state.url || inputFields.url.getValue();
  const filteredToUrl = newMethodCache
    .filter(method => method.url === activeUrl);

    // methods
  filteredToUrl
    .forEach((method) => {
      const service = method.service;
      const url = method.url;
      if (service) {
        inputFields.method.addOptionGroup(service.path, {
          label: service.name,
          value: service.path,
          url,
          service,
        });
      }
      inputFields.method.addOption({
        optgroup: service ? service.path : method.path,
        text: method.path,
        value: method.path,
        url,
        service,
        method,
      });
    });
  inputFields.method.refreshOptions(false);

  // active method
  const path = state.method || inputFields.method.getValue();
  const activeMethod = filteredToUrl
    .filter(method => method.path === path)[0] || filteredToUrl[0] || { path: '' };
  inputFields.method.createItem(activeMethod.path, false);

  // body
  const body = activeMethod.body || activeMethod.example || '';
  const bodyIsJson = hasJson(body, false);
  inputFields.body.setValue(js(JSON.stringify(body)));
  if (bodyIsJson) {
    inputFields.body_type.innerText = 'application/json';
  } else {
    inputFields.body_type.innerText = 'text';
  }
}

function onStateChanged(e) {
  const state = e.detail.state;
  if (state.id) {
    setBody(state.method, state.url, state.body || inputFields.body.getValue()); // no dispatch
    inputFields.url.setValue(state.url, true);
    dispatchMethodCacheChanged();
  }
}

function onLogsToggle(e) {
  e.preventDefault();
  logsContainer.classList.toggle('hidden');
}

function onLogsChanged(e) {
  const logs = e.detail.logs;
  inputFields.logs.setValue(logs);
}

getUrls().forEach((url) => {
  inputFields.url.createItem(url);
});

// Event listeners
methodEvent.addEventListener('change', onMethodCacheUpdated);
stateEvent.addEventListener('change', onStateChanged);
logsEvent.addEventListener('change', onLogsChanged);

inputFields.url.on('change', onUrlChange);
inputFields.method.on('change', onMethodChange);
inputFields.body.on('change', onBodyChange);
inputFields.send.addEventListener('click', onSend);
inputFields.reset.addEventListener('click', onReset);
inputFields.logsBtn.addEventListener('click', onLogsToggle);

dispatchMethodCacheChanged();
