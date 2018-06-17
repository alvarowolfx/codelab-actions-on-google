'use strict';

const functions = require('firebase-functions');
const { dialogflow, DialogFlowConversation } = require('actions-on-google');

const INTENT_PRICE = 'Price';

/**
 * @param {DialogFlowConversation} assistant
 */
function priceHandler(assistant) {  
  const msg = 'Getting current price via Firebase';  
  assistant.close(msg);
}

const app = dialogflow();
app.intent(INTENT_PRICE, priceHandler);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
