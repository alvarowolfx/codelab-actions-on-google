/**
 * @param {DialogflowConversation} assistant
 */
function userDataHandler(assistant, params, confirmationGranted) {
  let order = assistant.contexts.get(CTX_ORDER_PIZZA).parameters['order']      
  if (order) {
    order = order.value;
  }
  if (confirmationGranted) {
    if (!order.address) {      
      order.location = assistant.device.location;
      order.address = order.location.formattedAddress;
    }
    order.name = assistant.user.name.display;

    assistant.close(
      `Your order has been received ${order.name}. Soon your ${
        order.type
      } pizza will arrive.`
    );
  }
}
