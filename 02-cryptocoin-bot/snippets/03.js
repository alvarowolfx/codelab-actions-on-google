const fetch = require('node-fetch');

const BASE_API_URL = 'https://api.cryptonator.com/api';
const TICKER_METHOD = '/ticker';

const CRYPTO_CURRENCY_NAMES = {
  doge: 'dogecoin',
  btc: 'bitcoin',
  eth: 'ethereum'
};

const formattedCryptoCurrency =
  CRYPTO_CURRENCY_NAMES[cryptoCurrency] || cryptoCurrency;
const formattedCurrency = currency.toUpperCase();

const url = BASE_API_URL + TICKER_METHOD + `/${cryptoCurrency}-${currency}`;
return fetch(url)
  .then(res => res.json())
  .then(res => {
    let { ticker } = res;
    let { price } = ticker;

    const formattedPrice = parseFloat(price).toFixed(2);
    const msg = `Right now the price of a ${formattedCryptoCurrency} is ${
      formattedPrice
    } ${formattedCurrency}.`;

    assistant.close(msg);
  })
  .catch(res => {
    const msg = `Sorry, I cannot get the current price for ${
      formattedCryptoCurrency
    } right now. Try again later.`;
    assistant.close(msg);
  });
