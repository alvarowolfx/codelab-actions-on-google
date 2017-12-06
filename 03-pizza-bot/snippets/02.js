/**
 * @param {DialogflowApp} assistant
 */
function isScreenAvailable(assistant) {
  return assistant.hasAvailableSurfaceCapabilities(
    assistant.SurfaceCapabilities.SCREEN_OUTPUT
  );
}

if (isScreenAvailable(assistant)) {
  let msg = assistant
    .buildRichResponse()
    .addSimpleResponse(welcoming)
    .addSuggestions(['margherita', 'peperoni', 'marinara']);
  assistant.ask(msg);
} else {
  assistant.ask({
    speech: welcoming + ' Peperoni and Margherita are pretty popular!',
    displayText: welcoming
  });
}
