'use strict';

const functions = require('firebase-functions');
const { DialogflowApp } = require('actions-on-google');
const fetch = require('node-fetch');

const ACTION_PRICE = 'price';
const ACTION_WELCOME = 'input.welcome';
const ARG_CRYPTO_CURRENCY = 'CryptoCurrency';
const ARG_CURRENCY = 'Currency';

const BASE_API_URL = 'https://api.cryptonator.com/api';
const TICKER_METHOD = '/ticker';

const CRYPTO_CURRENCY_NAMES = {
  doge: 'dogecoin',
  btc: 'bitcoin',
  eth: 'ethereum'
};

const SUGGESTIONS = [
  'How much bitcoin costs',
  'dogecoin in brl',
  'ethereum in eur'
];

/**
 * @param {DialogflowApp} assistant
 */
function priceHandler(assistant) {
  const cryptoCurrency = assistant.getArgument(ARG_CRYPTO_CURRENCY);
  const currency = assistant.getArgument(ARG_CURRENCY) || 'USD';
  const formattedCryptoCurrency =
    CRYPTO_CURRENCY_NAMES[cryptoCurrency] || cryptoCurrency;
  const formattedCurrency = currency.toUpperCase();

  const url = BASE_API_URL + TICKER_METHOD + `/${cryptoCurrency}-${currency}`;
  fetch(url)
    .then(res => res.json())
    .then(res => {
      let { ticker } = res;
      let { price } = ticker;

      const formattedPrice = parseFloat(price).toFixed(2);
      const msg = `Right now the price of a ${formattedCryptoCurrency} is ${
        formattedPrice
      } ${formattedCurrency}.`;

      assistant.ask(msg);
    })
    .catch(res => {
      const msg = `Sorry, I cannot get the current price for ${
        formattedCryptoCurrency
      } right now. Try again later.`;
      assistant.tell(msg);
    });
}

/**
 * @param {DialogflowApp} assistant
 */
function welcomeHandler(assistant) {
  const msg = assistant
    .buildRichResponse()
    .addSimpleResponse(
      'Welcome to CryptoCurrency Bot. Do you like to know the price for which cryptocurrency ?'
    )
    .addSuggestions(SUGGESTIONS);
  assistant.ask(msg);
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (req, res) => {
    const assistant = new DialogflowApp({ request: req, response: res });

    const actionMap = new Map();
    actionMap.set(ACTION_PRICE, priceHandler);
    actionMap.set(ACTION_WELCOME, welcomeHandler);

    assistant.handleRequest(actionMap);
  }
);
