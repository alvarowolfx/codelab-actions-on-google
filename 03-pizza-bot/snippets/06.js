const userId = assistant.getUser().userId;
order.name = assistant.getUserName().displayName;
order.userId = userId;

const saveUserPromise = saveUserData(
  userId,
  order.name,
  order.location,
  order.adress
);

const saveOrderPromise = saveOrder(order);

Promise.all([saveUserPromise, saveOrderPromise])
  .then(() => {
    tellOrderInfo(assistant, order);
  })
  .catch(e => {
    assistant.tell('Sorry, but something bad happened with your order.');
  });

/**  */
function tellOrderInfo(assistant, order) {
  assistant.tell(
    `Your order has been received ${order.name}. Soon your ${
      order.type
    } pizza will arrive.`
  );
}
