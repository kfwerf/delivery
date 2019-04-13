import { stateEvent, getState, setState } from './app';

const history = [];
const historyList = document.querySelector('.history');

function getHistoryById(id) {
  return id === null ? null : history[history.findIndex(historyItem => historyItem.id === id)];
}

function getElementByHistory(item) {
  return historyList.querySelector(`[data-id="${item.id}"]`);
}

function getHistoryElements() {
  return [...historyList.querySelectorAll('.history-item')];
}

function createHistoryElement(item) {
  return `<li class="list-group-item history-item" data-id="${item.id}">
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
    ${list}
  </ul>`;
}

function setActive(item) {
  const active = 'active';
  const lastItem = historyList.querySelector(`.${active}`);
  if (lastItem) {
    lastItem.classList.remove(active);
  }
  item.classList.add(active);
}

function onHistory(evt) {
  const id = Number(evt.currentTarget.getAttribute('data-id'));
  const historyItem = getHistoryById(id);
  setState(historyItem);
}

function updateHistoryElements() {
  const items = history.concat([])
    .reverse()
    .map((item, idx) => createHistoryElement(item, idx))
    .reduce((a, b) => `${a}${b}`, '');

  getHistoryElements().forEach(el => el.removeEventListener('click', onHistory));
  historyList.innerHTML = createHistoryList(items);
  getHistoryElements().forEach(el => el.addEventListener('click', onHistory));

  const state = getState();
  if (state && state.id) {
    const active = getElementByHistory(state);
    setActive(active);
  }
}

function updateHistory(newState) {
  let item = getHistoryById(newState.id);
  if (item) {
    item = Object.assign({}, newState);
  } else {
    history.push(Object.assign({}, newState));
  }
}

function setStorage(items) {
  localStorage.setItem('history', JSON.stringify(items));
}

function getStorage() {
  try {
    return JSON.parse(localStorage.getItem('history')) || [];
  } catch (_) {
    return [];
  }
}

function onStateChanged(e) {
  const newState = e.detail.state;
  if (newState.id) {
    updateHistory(newState);
    updateHistoryElements();
    setStorage(history);
  }
}

stateEvent.addEventListener('change', onStateChanged);

const stored = getStorage();
stored.forEach((item) => {
  updateHistory(item);
});
updateHistoryElements();
if (!stored.length) {
  updateHistoryElements();
}

