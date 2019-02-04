import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/shell/shell';
import codeMirror from 'codemirror';
import grpcurl from './grpcurl';
import detect from './autodetect';
import { INPUT_FIELDS, BODY_TYPES, codeMirrorConfig, setState, getState, stateEvent, getId, equals } from './app';

// Input
const inputFields = {
  [INPUT_FIELDS.AUTODETECT]: document.querySelector('button.autodetect'),
  [INPUT_FIELDS.URL]: document.querySelector('input.server'),
  [INPUT_FIELDS.METHOD]: document.querySelector('input.method'),
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

function onStateChange() {
  const state = getState();
  inputFields[INPUT_FIELDS.URL].value = state[INPUT_FIELDS.URL];
  inputFields[INPUT_FIELDS.METHOD].value = state[INPUT_FIELDS.METHOD];
  if (typeof state[INPUT_FIELDS.BODY] === 'string') {
    inputFields[INPUT_FIELDS.BODY].setValue(state[INPUT_FIELDS.BODY]);
  }
  inputFields[INPUT_FIELDS.BODY_TYPE].value = state[INPUT_FIELDS.BODY_TYPE];
}

function inputToState() {
  return Object.assign({
    id: getId(),
    [INPUT_FIELDS.URL]: inputFields[INPUT_FIELDS.URL].value,
    [INPUT_FIELDS.METHOD]: inputFields[INPUT_FIELDS.METHOD].value,
  }, parseBody(inputFields[INPUT_FIELDS.BODY].getValue()));
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
      setState(newState);
    }
    console.log('sending...', getState());
    grpcurl.send(getState()).then(res => {
      console.log('response', res + '');
      inputFields[INPUT_FIELDS.RESPONSE].setValue(res + '');
    });
  }
}

function onAutodetect(e) {
  e.preventDefault();
  const state = inputToState();
  console.log('autodetecting... send', state[INPUT_FIELDS.URL]);
  detect(state[INPUT_FIELDS.URL]).then(results => console.log(results));
}

// Event listeners
inputFields[INPUT_FIELDS.AUTODETECT].addEventListener('click', onAutodetect);
inputFields[INPUT_FIELDS.SEND].addEventListener('click', onSend);
stateEvent.addEventListener('change', onStateChange);
onStateChange();
