export const getSavedTickerIds = () => {
  const savedTickerIds = localStorage.getItem('saved_tickers')
    ? JSON.parse(localStorage.getItem('saved_tickers'))
    : [];

  return savedTickerIds;
};

export const saveTickerIds = (tickerIdArr) => {
  if (tickerIdArr.length) {
    localStorage.setItem('saved_tickers', JSON.stringify(tickerIdArr));
  } else {
    localStorage.removeItem('saved_tickers');
  }
};

export const removeBookId = (tickerId) => {
  const savedTickerIds = localStorage.getItem('saved_tickers')
    ? JSON.parse(localStorage.getItem('saved_tickers'))
    : null;

  if (!savedTickerIds) {
    return false;
  }

  const updatedSavedTickerIds = savedTickerIds?.filter((savedTickerId) => savedTickerId !== tickerId);
  localStorage.setItem('saved_tickers', JSON.stringify(updatedSavedTickerIds));

  return true;
};
