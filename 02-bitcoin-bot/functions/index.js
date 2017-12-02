'use strict';

const functions = require('firebase-functions');
const { DialogflowApp } = require('actions-on-google');

const ACTION_PRICE = 'price';
const ACTION_TOTAL = 'total';
const ARG_CRYPTO_CURRENCY = 'CryptoCurrency';
const ARG_CURRENCY = 'Currency';

/**
 * @param {DialogflowApp} assistant
 */
function priceHandler(assistant) {
  let cryptoCurrency = assistant.getArgument(ARG_CRYPTO_CURRENCY);
  let currency = assistant.getArgument(ARG_CURRENCY) || 'USD';
  const msg = `Getting current price for ${cryptoCurrency} in ${
    currency
  } via Firebase`;
  assistant.tell(msg);
}

/**
 * @param {DialogflowApp} assistant
 */
function totalHandler(assistant) {
  let cryptoCurrency = assistant.getArgument(ARG_CRYPTO_CURRENCY);
  let currency = assistant.getArgument(ARG_CURRENCY) || 'USD';
  const msg = `Getting total price for ${cryptoCurrency} in ${
    currency
  } via Firebase`;
  assistant.tell(msg);
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (req, res) => {
    const assistant = new DialogflowApp({ request: req, response: res });

    const actionMap = new Map();
    actionMap.set(ACTION_PRICE, priceHandler);
    actionMap.set(ACTION_TOTAL, totalHandler);

    assistant.handleRequest(actionMap);
  }
);
