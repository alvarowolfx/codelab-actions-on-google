/**
 * @param {DialogflowConversation} assistant
 */
function isScreenAvailable(assistant) {
  return assistant.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')
}

if (isScreenAvailable(assistant)) {    
  assistant.ask(welcoming);
  assistant.ask(new Suggestions(['margherita', 'peperoni', 'marinara']));
} else {
  const msg = new SimpleResponse({
    speech: welcoming + ' Peperoni and Marguerita are pretty popular!',      
  });
  assistant.ask(msg);
}