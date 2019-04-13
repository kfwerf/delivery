import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/shell/shell';
import codeMirror from 'codemirror';
import { js } from 'js-beautify';
import jQuery from 'jquery';
import 'selectize';

import grpcurl from './grpcurl';
import detect from './autodetect';
import { INPUT_FIELDS, BODY_TYPES, codeMirrorConfig, setState, getState, stateEvent, getId, equals } from './app';

// Input
const inputFields = {
  [INPUT_FIELDS.AUTODETECT]: document.querySelector('button.autodetect'),
  [INPUT_FIELDS.URL]: jQuery('.url').selectize({
    create: true,
    createFilter: url => url.length > 3,
    sortField: 'text',
    placeholder: 'localhost:443',
  })[0].selectize,
  [INPUT_FIELDS.METHOD]: jQuery('.method').selectize({
    create: true,
    createFilter: method => method.length > 3,
    sortField: 'text',
    placeholder: 'packagename.serviceName/Method',
  })[0].selectize,
  [INPUT_FIELDS.BODY_TYPE]: document.querySelector('.type'),
  [INPUT_FIELDS.BODY]: codeMirror.fromTextArea(
    document.querySelector('.body'),
    Object.assign(codeMirrorConfig, {
      mode: 'javascript',
    })),
  [INPUT_FIELDS.RESPONSE]: codeMirror.fromTextArea(
    document.querySelector('.response'),
    Object.assign(codeMirrorConfig, {
      mode: 'shell',
      readOnly: true,
    })),
  [INPUT_FIELDS.SEND]: document.querySelector('.send'),
  [INPUT_FIELDS.RESET]: document.querySelector('.reset'),
};

function parseBody(body) {
  try {
    return {
      [INPUT_FIELDS.BODY]: JSON.stringify(JSON.parse(body)),
      [INPUT_FIELDS.BODY_TYPE]: BODY_TYPES.JSON,
    };
  } catch (e) {
    return {
      [INPUT_FIELDS.BODY]: body,
      [INPUT_FIELDS.BODY_TYPE]: BODY_TYPES.TEXT,
    };
  }
}

function validateState(newState) {
  const url = newState[INPUT_FIELDS.URL];
  const method = newState[INPUT_FIELDS.METHOD];
  const hasId = !!newState[INPUT_FIELDS.ID];
  const isUrlValid = url && url.length > 3;
  const isMethodValid = method && method.length > 3;
  return hasId && isUrlValid && isMethodValid;
}

function inputToState() {
  return Object.assign({
    id: getId(),
    [INPUT_FIELDS.URL]: inputFields[INPUT_FIELDS.URL].getValue(),
    [INPUT_FIELDS.METHOD]: inputFields[INPUT_FIELDS.METHOD].getValue(),
  }, parseBody(inputFields[INPUT_FIELDS.BODY].getValue()));
}

function equalsWithoutId(a, b) {
  const aWithoutId = Object.assign({ id: null }, a);
  const bWithoutId = Object.assign({ id: null }, b);
  return equals(aWithoutId, bWithoutId);
}

function onAutodetect(url) {
  console.log('autodetecting...', url);
  return detect(url).then((results) => {
    console.log('autodetected', results);
    inputFields[INPUT_FIELDS.METHOD].clear(true);
    inputFields[INPUT_FIELDS.METHOD].clearOptions();
    results.servicesWithExample.forEach((service) => {
      inputFields[INPUT_FIELDS.METHOD]
        .addOptionGroup(service.path, {
          label: service.name,
          value: service.path,
          url,
          service,
        });
      service.methods.forEach((method) => {
        inputFields[INPUT_FIELDS.METHOD].addOption({
          optgroup: service.path,
          text: method.path,
          value: method.path,
          url,
          service,
          method,
        });
      });
    });
    inputFields[INPUT_FIELDS.METHOD].refreshOptions(false);
    const firstMethodValue = results &&
      results.servicesWithExample &&
      results.servicesWithExample[0] &&
      results.servicesWithExample[0].methods &&
      results.servicesWithExample[0].methods[0] &&
      results.servicesWithExample[0].methods[0].path;
    if (firstMethodValue && inputFields[INPUT_FIELDS.METHOD].getValue() === '') {
      inputFields[INPUT_FIELDS.METHOD].setValue(firstMethodValue, false);
    }
    return results;
  }).catch((err) => {
    console.log(err);
    return err;
  });
}

function onStateChange() {
  const state = getState();
  console.log('onStateChange');
  inputFields[INPUT_FIELDS.URL].createItem(state[INPUT_FIELDS.URL]);
  inputFields[INPUT_FIELDS.METHOD].createItem(state[INPUT_FIELDS.METHOD]);
  if (typeof state[INPUT_FIELDS.BODY] === 'string') {
    inputFields[INPUT_FIELDS.BODY].setValue(js(state[INPUT_FIELDS.BODY]));
  }
  inputFields[INPUT_FIELDS.BODY_TYPE].value = state[INPUT_FIELDS.BODY_TYPE];
}

function onMethodChange(key) {
  const option = inputFields[INPUT_FIELDS.METHOD].options[key];
  if (option.method) {
    inputFields[INPUT_FIELDS.BODY].setValue(js(JSON.stringify(option.method.example)));
  }
}

function onSend(e) {
  console.log('trying...', inputToState());
  e.preventDefault();
  const newState = inputToState();
  const isValid = validateState(newState);
  if (isValid) {
    if (!equalsWithoutId(getState(), newState)) {
      setState(newState);
    }
    console.log('sending...', getState());
    grpcurl.send(getState()).then(res => {
      console.log('response', res + '');
      inputFields[INPUT_FIELDS.RESPONSE].setValue(res + '');
    });
  }
}

// Event listeners
// stateEvent.addEventListener('change', onStateChange);

inputFields[INPUT_FIELDS.URL].on('change', onAutodetect);
inputFields[INPUT_FIELDS.METHOD].on('change', onMethodChange);
inputFields[INPUT_FIELDS.SEND].addEventListener('click', onSend);
