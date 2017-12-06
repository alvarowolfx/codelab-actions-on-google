const ARG_TYPE = 'type';
const ARG_TOPPING = 'topping';
const ARG_CRUST = 'crust';
const ARG_SIZE = 'size';
const ARG_TIME = 'time';
const ARG_ADDRESS = 'address';
const ARG_SAUCE = 'sauce';

const CTX_ORDER_PIZZA = 'orderpizza';

/**
 * @param {DialogflowApp} assistant
 */
function getOrder(assistant) {
  const type = assistant.getArgument(ARG_TYPE);
  const topping = assistant.getArgument(ARG_TOPPING);
  const crust = assistant.getArgument(ARG_CRUST);
  const sauce = assistant.getArgument(ARG_SAUCE);
  const size = assistant.getArgument(ARG_SIZE);
  const time = assistant.getArgument(ARG_TIME);
  const address = assistant.getArgument(ARG_ADDRESS);

  const order = {
    type,
    topping,
    crust,
    sauce,
    size,
    time,
    address
  };

  return order;
}

/**
 * @param {DialogflowApp} assistant
 */
function orderPizzaHandler(assistant) {
  const order = getOrder(assistant);

  assistant.setContext('orderpizza', 5, { order });

  if (order.address) {
    assistant.askForPermission(
      'To complete your order we need you name',
      assistant.SupportedPermissions.NAME
    );
  } else {
    assistant.askForPermissions(
      'To complete your order we need you name and your location',
      [
        assistant.SupportedPermissions.DEVICE_PRECISE_LOCATION,
        assistant.SupportedPermissions.NAME
      ]
    );
  }
}
