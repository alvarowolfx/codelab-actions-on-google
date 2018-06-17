const { dialogflow, DialogFlowConversation, Suggestions } = require('actions-on-google');

const SUGGESTIONS = [
  'How much bitcoin costs',
  'dogecoin in brl',
  'ethereum in eur'
];

/**
 * @param {DialogflowApp} assistant
 */
function welcomeHandler(assistant) {
  assistant.ask('Welcome to CryptoCurrency Bot. Do you like to know the price for which cryptocurrency ?')  
  assistant.ask(new Suggestions(SUGGESTIONS));
}
