import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/shell/shell';
import codeMirror from 'codemirror';
import grpcurl from './grpcurl';

// App
let history = [];
const current = {
  url: null,
  method: null,
  body: null,
  bodyType: 'application/json',
};

const historyList = document.querySelector('.history');

// Input
const urlInput = document.querySelector('input.server');
const methodInput = document.querySelector('input.method');
const bodyType = document.querySelector('.type');
const bodyInput = codeMirror.fromTextArea(document.querySelector('.body'), {
  mode: 'javascript',
  indentWithTabs: false,
  tabSize: 2,
  lineNumbers: true,
  theme: 'monokai',
});
const responseInput = codeMirror.fromTextArea(document.querySelector('.response'), {
  mode: 'shell',
  indentWithTabs: false,
  tabSize: 2,
  lineNumbers: true,
  theme: 'monokai',
});
const sendBtn = document.querySelector('.send');
const resetBtn = document.querySelector('.reset');

function onHistory(evt) {
  const lastActive = historyList.querySelector('.active');
  if (lastActive) {
    lastActive.classList.remove('active');
  }
  evt.currentTarget.classList.add('active');

  // asign values to input
  const fromHistory = history[evt.currentTarget.getAttribute('data-idx')];
  urlInput.value = fromHistory.url;
  methodInput.value = fromHistory.method;
  if (fromHistory.body) {
    bodyInput.setValue(fromHistory.body);
  }

  current.url = fromHistory.url;
  current.method = fromHistory.method;
  current.body = fromHistory.body;
  current.bodyType = fromHistory.bodyType;
}

function createHistoryElement(item, idx) {
  return `<li class="list-group-item history-item" data-idx="${idx}">
    <div class="media-body">
      <strong>${item.url}</strong>
      <p>${item.method}</p>
    </div>
  </li>`;
}

function createEmptyHistoryElement() {
  return `<li class="list-group-item">
    <div class="media-body">
      <strong>No history</strong>
      <p>Create your first request</p>
    </div>
  </li>`;
}

function createHistoryList(items) {
  const list = items.length ? items : createEmptyHistoryElement();
  return `<ul class="list-group">
    <li class="list-group-header">
      <input class="form-control" type="text" placeholder="Search through the history">
    </li>
    ${list}
  </ul>`;
}

function updateHistoryElements() {
  const items = history
  .reverse()
  .map((item, idx) => createHistoryElement(item, idx))
  .reduce((a, b) => `${a}${b}`, '');

  [...historyList.querySelectorAll('.history-item')]
    .map(item => item.removeEventListener('click', onHistory));
  historyList.innerHTML = createHistoryList(items);
  [...historyList.querySelectorAll('.history-item')]
    .map(item => item.addEventListener('click', onHistory));
}

function updateBodyType() {
  bodyType.innerHTML = current.bodyType;
}

function onCurrentInputChange(key, evt) {
  current[key] = evt.currentTarget.value;
  console.log('Current: ', current);
}

function onBodyChanged(editor) {
  try {
    current.body = JSON.stringify(JSON.parse(editor.getValue()));
    current.bodyType = 'application/json';
    console.log('Current: ', current);
  } catch (e) {
    console.log('Not JSON');
    current.body = editor.getValue();
    current.bodyType = 'text';
    console.log('Current: ', current);
  }

  // Update based on input change
  updateBodyType();
}

function isDiff(last) {
  return JSON.stringify(last) !== JSON.stringify(current);
}

function storeCurrent() {
  console.log(history);
  if (history.length) {
    const last = history[history.length - 1];
    if (isDiff(last)) {
      history.push(Object.assign({}, current));
    }
  } else {
    history.push(Object.assign({}, current));
  }

  // Persist
  localStorage.setItem('history', JSON.stringify(history));
  updateHistoryElements();
}

function onSend(e) {
  console.log('sending...', current);
  storeCurrent();
  e.preventDefault();
  grpcurl.send(current).then(res => {
    console.log('response', res + '');
    responseInput.setValue(res + '');
  });
}


urlInput.addEventListener('change', onCurrentInputChange.bind(null, 'url'));
methodInput.addEventListener('change', onCurrentInputChange.bind(null, 'method'));
bodyInput.on('change', onBodyChanged);

sendBtn.addEventListener('click', onSend);

try {
  history = JSON.parse(localStorage.getItem('history'));
  updateHistoryElements();
} catch (e) {
  console.log('could not set history', e);
}
