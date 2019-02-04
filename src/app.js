// Static stuff
export const BODY_TYPES = {
  JSON: 'application/json',
  TEXT: 'text',
};

export const INPUT_FIELDS = {
  AUTOMETHODS: 'automethods',
  AUTODETECT: 'autodetect',
  ID: 'id',
  URL: 'url',
  METHOD: 'method',
  BODY: 'body',
  BODY_TYPE: 'bodyType',
  RESPONSE: 'response',
  SEND: 'send',
  RESET: 'reset',
};

export const codeMirrorConfig = {
  indentWithTabs: false,
  tabSize: 2,
  lineNumbers: true,
  theme: 'monokai',
  smartIndent: true,
};

let state = {
  [INPUT_FIELDS.ID]: null,
  [INPUT_FIELDS.URL]: null,
  [INPUT_FIELDS.METHOD]: null,
  [INPUT_FIELDS.BODY]: null,
  [INPUT_FIELDS.BODY_TYPE]: null,
};

export function equals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const stateEvent = document.createElement('div');

function dispatchStateChanged() {
  const event = document.createEvent('HTMLEvents');
  event.initEvent('change', true, false);
  stateEvent.dispatchEvent(event);
}

export function getId() {
  return Math.round((new Date().getTime() * 1000) + (Math.random() * 100));
}

export function setState(newState) {
  if (!newState.id) {
    console.error('missing id');
  }
  if (!equals(state, newState)) {
    state = Object.assign(state, newState);
    dispatchStateChanged();
  }
}

export function getState() {
  return Object.assign(state, {});
}
