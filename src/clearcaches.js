document.querySelector('.clearcache').addEventListener('click', () => {
  localStorage.removeItem('stateCache');
  localStorage.removeItem('history');
  localStorage.removeItem('autodetecthistory');
  localStorage.removeItem('methodCache');
});
