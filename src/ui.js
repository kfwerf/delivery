import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/shell/shell';
import codeMirror from 'codemirror';
import { js } from 'js-beautify';
import jQuery from 'jquery';
import 'selectize';

import grpcurl from './grpcurl';
import detect from './autodetect';
import { STATE, BODY_TYPES, codeMirrorConfig, setState, getState, stateEvent, getId, equals } from './app';

// Input
const inputFields = {
  [STATE.AUTODETECT]: document.querySelector('button.autodetect'),
  [STATE.URL]: jQuery('.url').selectize({
    create: true,
    createFilter: url => url.length > 3,
    sortField: 'text',
    placeholder: 'localhost:443',
  })[0].selectize,
  [STATE.METHOD]: jQuery('.method').selectize({
    create: true,
    createFilter: method => method.length > 3,
    sortField: 'text',
    placeholder: 'packagename.serviceName/Method',
  })[0].selectize,
  [STATE.BODY_TYPE]: document.querySelector('.type'),
  [STATE.BODY]: codeMirror.fromTextArea(
    document.querySelector('.body'),
    Object.assign(codeMirrorConfig, {
      mode: 'javascript',
    })),
  [STATE.RESPONSE]: codeMirror.fromTextArea(
    document.querySelector('.response'),
    Object.assign(codeMirrorConfig, {
      mode: 'shell',
      readOnly: true,
    })),
  [STATE.SEND]: document.querySelector('.send'),
  [STATE.RESET]: document.querySelector('.reset'),
};

function parseBody(body) {
  try {
    return {
      [STATE.BODY]: JSON.stringify(JSON.parse(body)),
      [STATE.BODY_TYPE]: BODY_TYPES.JSON,
    };
  } catch (e) {
    return {
      [STATE.BODY]: body,
      [STATE.BODY_TYPE]: BODY_TYPES.TEXT,
    };
  }
}

function validateState(newState) {
  const url = newState[STATE.URL];
  const method = newState[STATE.METHOD];
  const hasId = !!newState[STATE.ID];
  const isUrlValid = url && url.length > 3;
  const isMethodValid = method && method.length > 3;
  return hasId && isUrlValid && isMethodValid;
}

function inputToState() {
  return Object.assign({
    [STATE.URL]: inputFields[STATE.URL].getValue(),
    [STATE.METHOD]: inputFields[STATE.METHOD].getValue(),
  }, parseBody(inputFields[STATE.BODY].getValue()));
}

function equalsWithoutId(a, b) {
  const aWithoutId = Object.assign({ id: null }, a);
  const bWithoutId = Object.assign({ id: null }, b);
  return equals(aWithoutId, bWithoutId);
}

function onSend(e) {
  console.log('trying...', inputToState());
  e.preventDefault();
  const newState = inputToState();
  const isValid = validateState(newState);
  if (isValid) {
    if (!equalsWithoutId(getState(), newState)) {
      setState(Object.assign({
        id: getId(),
      }, newState));
    }
    console.log('sending...', getState());
    grpcurl.send(getState()).then(res => {
      console.log('response', res + '');
      inputFields[STATE.RESPONSE].setValue(res + '');
    });
  }
}

function hasPath(services, path) {
  console.log('hasPath', services, path);
  return !!services
    .map(service => service.methods)
    .reduce((a, b) => a.concat(b), [])
    .filter(method => method.path === path).length;
}

function findFirst(services) {
  return services
  .map(service => service.methods)
  .reduce((a, b) => a.concat(b), [])
  .map(method => method.path)[0] || '';
}

function onStateChange(e) {
  const { oldState, newState } = e.detail;
  console.log('onStateChange', { oldState, newState });
  const hasUrlChanged = oldState[STATE.URL] !== newState[STATE.URL];
  const hasMethodChanged = oldState[STATE.METHOD] !== newState[STATE.METHOD];
  const hasBodyChanged = oldState[STATE.BODY] !== newState[STATE.BODY];
  detect(newState[STATE.URL]).then((results) => {
    if (hasUrlChanged) {
      console.log('hasUrlChanged', oldState[STATE.URL], newState[STATE.URL]);
      inputFields[STATE.URL].addOption({
        text: newState[STATE.URL],
        value: newState[STATE.URL],
      });
      inputFields[STATE.URL].addItem(newState[STATE.URL], true);
      const services = results.servicesWithExample;
      const currentPath = newState[STATE.METHOD];
      const isMethodValid = hasPath(services, currentPath);
      const url = inputFields[STATE.URL];
      const currentMethod = isMethodValid ? currentPath : findFirst(services);
      inputFields[STATE.METHOD].clearOptions();
      services.forEach((service) => {
        inputFields[STATE.METHOD]
          .addOptionGroup(service.path, {
            label: service.name,
            value: service.path,
            url,
            service,
          });
        service.methods.forEach((method) => {
          inputFields[STATE.METHOD].addOption({
            optgroup: service.path,
            text: method.path,
            value: method.path,
            url,
            service,
            method,
          });
        });
      });
      inputFields[STATE.METHOD].refreshOptions(false);
      if (!isMethodValid) {
        console.log('method invalid setting state');
        setState(Object.assign(newState, {
          [STATE.METHOD]: currentMethod,
        }));
      }
    }
    if (hasMethodChanged) {
      console.log('hasMethodChanged', oldState[STATE.METHOD], newState[STATE.METHOD]);
      inputFields[STATE.URL].addItem(newState[STATE.METHOD], true);
      const option = inputFields[STATE.METHOD].options[newState[STATE.METHOD]];
      const example = option && option.method && option.method.example;

      if (example) {
        console.log('setState body with example');
        setState(Object.assign(newState, {
          [STATE.BODY]: JSON.stringify(example),
        }));
      }
    }
    if (hasBodyChanged && typeof newState[STATE.BODY] === 'string') {
      console.log('hasBodyChanged', oldState[STATE.BODY], newState[STATE.BODY]);
      inputFields[STATE.BODY].setValue(js(newState[STATE.BODY]), true);
      inputFields[STATE.BODY_TYPE].value = newState[STATE.BODY_TYPE];
    }
  });
}

function onUpdateUrl() {
  // Do not stamp a id, all of it becomes with id when its send
  const state = getState();
  const stateFromInput = inputToState();
  const isValid = stateFromInput[STATE.URL].length > 3;
  const isChanged = stateFromInput[STATE.URL] !== state[STATE.URL];
  console.log('onUpdateUrl', isChanged, stateFromInput);
  if (isValid && isChanged) {
    setState(stateFromInput);
  }
}

function onUpdateMethod() {
  const state = getState();
  const stateFromInput = inputToState();
  const isValid = stateFromInput[STATE.METHOD].length > 3;
  const isChanged = stateFromInput[STATE.METHOD] !== state[STATE.METHOD];
  console.log('onUpdateMethod', isChanged, stateFromInput);
  if (isValid && isChanged) {
    setState(stateFromInput);
  }
}


// Event listeners
stateEvent.addEventListener('change', onStateChange);
inputFields[STATE.URL].on('change', onUpdateUrl);
inputFields[STATE.METHOD].on('change', onUpdateMethod);
inputFields[STATE.SEND].addEventListener('click', onSend);
