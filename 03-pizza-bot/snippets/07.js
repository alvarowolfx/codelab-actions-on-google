
/**
 * @param {DialogflowConversation} assistant
 */
function orderPizzaHandler(assistant) {
  const order = getOrder(assistant);
  const userId = assistant.user.id;
  return getUser(userId).then(user => {      
    if(user){
      order.userId = userId;
        order.name = user.displayName;
        order.address = user.address;
        order.location = user.location;
        return saveOrder(order).then(() => {
          return closeOrder(assistant, order);
        });
    } else {
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
  })
}