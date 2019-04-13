// Static stuff
export const BODY_TYPES = {
  JSON: 'application/json',
  TEXT: 'text',
};

export const INPUT_FIELDS = {
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
  [INPUT_FIELDS.ID]: null,
  [INPUT_FIELDS.URL]: null,
  [INPUT_FIELDS.METHOD]: null, // key is url
  [INPUT_FIELDS.BODY]: null, // key is url.metod
};

export function equals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const stateEvent = document.createElement('div');

function dispatchStateChanged(eventElement, oldState, newState) {
  const event = new CustomEvent('change', { detail: { oldState, newState } });
  eventElement.dispatchEvent(event);
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
