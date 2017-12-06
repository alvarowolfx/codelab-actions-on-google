/**
 * @param {DialogflowApp} assistant
 */
function orderPizzaHandler(assistant) {
  const order = getOrder(assistant);
  const userId = assistant.getUser().userId;
  getUser(userId).then(user => {
    if (user) {
      order.userId = userId;
      order.name = user.displayName;
      order.address = user.address;
      order.location = user.location;

      saveOrder(order).then(() => {
        tellOrderInfo(assistant, order);
      });
    } else {
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
  });
}
