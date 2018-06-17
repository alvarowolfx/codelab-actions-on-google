'use strict';

const functions = require('firebase-functions');
const { dialogflow, DialogflowConversation } = require('actions-on-google');

const INTENT_WELCOME = 'Default Welcome Intent';

/**
 * @param {DialogflowConversation} assistant
 */
function welcomeHandler(assistant) {
  let welcoming = 'Welcome to Mamma Mia Pizza!';
  if (assistant.user.name.display) {
    welcoming = `Welcome to Mamma Mia Pizza, is awesome to have you back ${assistant.user.name.display}!`;
  }
  welcoming += ' What pizza do you want today ?';

  assistant.ask(welcoming);  
}

const app = dialogflow();
app.intent(INTENT_WELCOME, welcomeHandler);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
