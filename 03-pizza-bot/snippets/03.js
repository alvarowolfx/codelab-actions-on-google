const ARG_TYPE = 'type';
const ARG_TOPPING = 'topping';
const ARG_CRUST = 'crust';
const ARG_SIZE = 'size';
const ARG_TIME = 'time';
const ARG_ADDRESS = 'address';
const ARG_SAUCE = 'sauce';

const INTENT_ORDER_PIZZA = 'order.pizza';

const CTX_ORDER_PIZZA = 'orderpizza';

/**
 * @param {DialogflowConversation} assistant
 */
function getOrder(assistant) {
  const type = assistant.parameters[ARG_TYPE];
  const topping = assistant.parameters[ARG_TOPPING];
  const crust = assistant.parameters[ARG_CRUST];
  const sauce = assistant.parameters[ARG_SAUCE];
  const size = assistant.parameters[ARG_SIZE];
  const time = assistant.parameters[ARG_TIME];
  const address = assistant.parameters[ARG_ADDRESS];

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
 * @param {DialogflowConversation} assistant
 */
function orderPizzaHandler(assistant) {
  const order = getOrder(assistant);
  console.log('order', order);

  assistant.contexts.set(CTX_ORDER_PIZZA, 5 , { order });

  if (order.address) {
    assistant.ask(new Permission({
      context: 'To complete your order we need you name',
      permissions: ['NAME']
    }));
  } else {
    assistant.ask(
      new Permission({
        context: 'To complete your order we need you name and your location',
        permissions: ['DEVICE_PRECISE_LOCATION', 'NAME']        
      })
    );
  }
}
