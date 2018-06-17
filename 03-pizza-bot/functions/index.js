'use strict';

const functions = require('firebase-functions');
const { dialogflow, DialogflowConversation, Suggestions, SimpleResponse, Permission } = require('actions-on-google');

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.database();

const INTENT_WELCOME = 'Default Welcome Intent';
const INTENT_ORDER_PIZZA = 'order.pizza';
const INTENT_USER_DATA = 'user.data';

const ARG_TYPE = 'type';
const ARG_TOPPING = 'topping';
const ARG_CRUST = 'crust';
const ARG_SIZE = 'size';
const ARG_TIME = 'time';
const ARG_ADDRESS = 'address';
const ARG_SAUCE = 'sauce';

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
function userDataHandler(assistant, params, confirmationGranted) {
  const ctx = assistant.contexts.get(CTX_ORDER_PIZZA);
  let order = ctx.parameters['order'];
  if (confirmationGranted) {
    if (!order.address) {
      order.location = assistant.device.location;
      order.address = order.location.formattedAddress || '';
    }

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
  }
}

function closeOrder(assistant, order) {
  assistant.close(
    `Your order has been received ${order.name}. Soon your ${
    order.type
    } pizza will arrive.`
  );
}


/**
 * @param {DialogflowConversation} assistant
 */
function orderPizzaHandler(assistant) {
  const order = getOrder(assistant);
  const userId = assistant.user.id;
  return getUser(userId).then(user => {
    if (user) {
      order.userId = userId;
      order.name = user.displayName;
      order.address = user.address;
      order.location = user.location;
      return saveOrder(order).then(() => {
        return closeOrder(assistant, order);
      });
    } else {
      assistant.contexts.set(CTX_ORDER_PIZZA, 5, { order });
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
  });
}

function welcomeHandler(assistant) {
  console.log(assistant.user);
  let welcoming = 'Welcome to Mamma Mia Pizza!';
  if (assistant.user.name.display) {
    welcoming = `Welcome to Mamma Mia Pizza, is awesome to have you back ${assistant.user.name.display}!`;
  }
  welcoming += ' What pizza do you want today ?';

  const msg = new SimpleResponse({
    speech: welcoming + 'Peperoni and Marguerita are pretty popular!',
    text: welcoming
  });

  if (isScreenAvailable(assistant)) {
    assistant.ask(msg);
    assistant.ask(new Suggestions(['margherita', 'peperoni', 'marinara']));
  } else {
    assistant.ask(msg);
  }
}

function isScreenAvailable(assistant) {
  return assistant.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')
}

function getUser(userId) {
  return db
    .ref(`users/${userId}`)
    .once('value')
    .then(snapshot => snapshot.val());
}

function saveOrder(order) {
  return db.ref('orders').push(order);
}

function saveUserData(userId, displayName, location, address) {
  delete location.address;
  return db.ref(`users/${userId}`).set({
    displayName,
    location: location || {},
    address: address || ''
  });
}


const app = dialogflow();
app.intent(INTENT_WELCOME, welcomeHandler);
app.intent(INTENT_ORDER_PIZZA, orderPizzaHandler);
app.intent(INTENT_USER_DATA, userDataHandler);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);