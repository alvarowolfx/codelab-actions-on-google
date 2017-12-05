const SUGGESTIONS = [
  'How much bitcoin costs',
  'dogecoin in brl',
  'ethereum in eur'
];

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
