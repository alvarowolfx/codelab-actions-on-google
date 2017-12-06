'use strict';

const functions = require('firebase-functions');
const { DialogflowApp } = require('actions-on-google');

const ACTION_WELCOME = 'input.welcome';

/**
 * @param {DialogflowApp} assistant
 */
function welcomeHandler(assistant) {
  let welcoming = 'Welcome to Mamma Mia Pizza, is awesome to have you back!';
  if (assistant.getLastSeen()) {
    welcoming = 'Welcome to Mamma Mia Pizza!';
  }
  welcoming += ' What pizza do you want today ?';

  assistant.ask({
    speech: welcoming + ' Peperoni and Margherita are pretty popular!',
    displayText: welcoming
  });
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (req, res) => {
    const assistant = new DialogflowApp({ request: req, response: res });

    const actionMap = new Map();
    actionMap.set(ACTION_WELCOME, welcomeHandler);
    assistant.handleRequest(actionMap);
  }
);
