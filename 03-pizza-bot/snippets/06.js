const userId = assistant.user.id;
order.name = assistant.user.name.display;
order.userId = userId;

const saveUserPromise = saveUserData(
  userId,
  order.name,
  order.location,
  order.adress
);

const saveOrderPromise = saveOrder(order);

return Promise.all([saveUserPromise, saveOrderPromise])
  .then(() => {
    closeOrder(assistant, order);
  })
  .catch(e => {
    assistant.close('Sorry, but something bad happened with your order.');
  });

/**  */
function closeOrder(assistant, order) {
  assistant.close(
    `Your order has been received ${order.name}. Soon your ${
      order.type
    } pizza will arrive.`
  );
}
