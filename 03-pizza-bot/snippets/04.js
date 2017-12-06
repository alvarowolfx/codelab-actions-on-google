/**
 * @param {DialogflowApp} assistant
 */
function userDataHandler(assistant) {
  let order = assistant.getContextArgument(CTX_ORDER_PIZZA, 'order');
  if (order) {
    order = order.value;
  }
  if (assistant.isPermissionGranted()) {
    if (!order.address) {
      order.location = assistant.getDeviceLocation();
      order.address = order.location.address;
    }
    order.name = assistant.getUserName().displayName;

    assistant.tell(
      `Your order has been received ${order.name}. Soon your ${
        order.type
      } pizza will arrive.`
    );
  }
}
