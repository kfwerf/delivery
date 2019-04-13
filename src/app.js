// Static stuff
export const BODY_TYPES = {
  JSON: 'application/json',
  TEXT: 'text',
};

export const STATE = {
  AUTODETECT: 'autodetect',
  ID: 'id',
  URL: 'url',
  METHOD: 'method',
  METHODS: 'methods',
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
  [STATE.ID]: null,
  [STATE.URL]: null,
  [STATE.METHOD]: null,
  [STATE.BODY]: null,
  [STATE.BODY_TYPE]: null,
};

export function equals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const stateEvent = document.createElement('div');

function dispatchStateChanged(oldState, newState) {
  const event = new CustomEvent('change', { detail: { oldState, newState } });
  stateEvent.dispatchEvent(event);
}

export function getId() {
  return Math.round((new Date().getTime() * 1000) + (Math.random() * 100));
}

export function setState(newState) {
  if (!equals(state, newState)) {
    const oldState = Object.assign({}, state);
    state = Object.assign(state, newState);
    dispatchStateChanged(oldState, newState);
  }
}

export function getState() {
  return Object.assign(state, {});
}
