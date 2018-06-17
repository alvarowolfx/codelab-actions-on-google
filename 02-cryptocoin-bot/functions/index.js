'use strict';

const functions = require('firebase-functions');
const { dialogflow, DialogFlowConversation, Suggestions } = require('INTENTs-on-google');
const fetch = require('node-fetch');

const INTENT_PRICE = 'price';
const INTENT_WELCOME = 'Default Welcome Intent';
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
 * @param {DialogFlowConversation} assistant
 */
function priceHandler(assistant) {  
  const cryptoCurrency = assistant.parameters[ARG_CRYPTO_CURRENCY];
  const currency = assistant.parameters[ARG_CURRENCY] || 'USD';
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
      assistant.close(msg);
    });
}

/**
 * @param {DialogflowApp} assistant
 */
function welcomeHandler(assistant) {
  assistant.ask('Welcome to CryptoCurrency Bot. Do you like to know the price for which cryptocurrency ?')  
  assistant.ask(new Suggestions(SUGGESTIONS));
}


const app = dialogflow();
app.intent(INTENT_WELCOME, welcomeHandler);
app.intent(INTENT_PRICE, priceHandler);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
