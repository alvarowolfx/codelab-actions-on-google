'use strict';

const functions = require('firebase-functions');
const { DialogflowApp } = require('actions-on-google');

const ACTION_PRICE = 'price';

/**
 * @param {DialogflowApp} assistant
 */
function priceHandler(assistant) {
  const msg = 'Getting current price via Firebase';
  assistant.tell(msg);
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (req, res) => {
    const assistant = new DialogflowApp({ request: req, response: res });

    const actionMap = new Map();
    actionMap.set(ACTION_PRICE, priceHandler);

    assistant.handleRequest(actionMap);
  }
);
