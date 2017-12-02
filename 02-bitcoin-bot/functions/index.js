'use strict';

const functions = require('firebase-functions');
const { DialogflowApp } = require('actions-on-google');

const ACTION_PRICE = 'price';
const ACTION_TOTAL = 'total';

/**
 * @param {DialogflowApp} assistant
 */
function priceHandler(assistant) {
  const msg = 'Getting current price via Firebase';
  assistant.tell(msg);
}

/**
 * @param {DialogflowApp} assistant
 */
function totalHandler(assistant) {
  const msg = 'Getting total price via Firebase';
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
