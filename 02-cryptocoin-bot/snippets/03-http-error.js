const CRYPTO_CURRENCY_PRICES = {
  doge: {
    brl: 0.01,
    eur: 0.00229419,
    usd: 0.00271395
  },
  btc: {
    brl: 56200.0,
    eur: 13495.25949889,
    usd: 16047.28556707
  },
  eth: {
    brl: 1559.53188079,
    eur: 372.98900227,
    usd: 426.70409479
  }
};

const CRYPTO_CURRENCY_NAMES = {
  doge: 'dogecoin',
  btc: 'bitcoin',
  eth: 'ethereum'
};

const formattedCryptoCurrency =
  CRYPTO_CURRENCY_NAMES[cryptoCurrency] || cryptoCurrency;
const formattedCurrency = currency.toUpperCase();

let price = CRYPTO_CURRENCY_PRICES[cryptoCurrency][currency];

const formattedPrice = parseFloat(price).toFixed(2);
const msg = `Right now the price of a ${formattedCryptoCurrency} is ${
  formattedPrice
} ${formattedCurrency}.`;

assistant.close(msg);
