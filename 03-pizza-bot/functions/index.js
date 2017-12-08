'use strict';

const functions = require('firebase-functions');
const { DialogflowApp } = require('actions-on-google');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();

const ACTION_WELCOME = 'input.welcome';
const ACTION_ORDER_PIZZA = 'order.pizza';
const ACTION_USER_DATA = 'user.data';

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
      assistant.setContext(CTX_ORDER_PIZZA, 5, { order });

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
      order.address = order.location.address || '';
    }

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
  }
}

function tellOrderInfo(assistant, order) {
  assistant.tell(
    `Your order has been received ${order.name}. Soon your ${
      order.type
    } pizza will arrive.`
  );
}

/**
 * @param {DialogflowApp} assistant
 */
function welcomeHandler(assistant) {
  let welcoming = 'Welcome to Mamma Mia Pizza, is awesome to have you back!';
  if (assistant.getLastSeen()) {
    welcoming = 'Welcome to Mamma Mia Pizza!';
  }
  welcoming += ' What pizza do you want today ?';

  if (isScreenAvailable(assistant)) {
    let msg = assistant
      .buildRichResponse()
      .addSimpleResponse(welcoming)
      .addSuggestions(['margherita', 'peperoni', 'marinara']);
    assistant.ask(msg);
  } else {
    assistant.ask({
      speech: welcoming + ' Peperoni and Margherita are pretty popular!',
      displayText: welcoming
    });
  }
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

/**
 * @param {DialogflowApp} assistant
 */
function isScreenAvailable(assistant) {
  return assistant.hasAvailableSurfaceCapabilities(
    assistant.SurfaceCapabilities.SCREEN_OUTPUT
  );
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (req, res) => {
    const assistant = new DialogflowApp({ request: req, response: res });

    const actionMap = new Map();
    actionMap.set(ACTION_WELCOME, welcomeHandler);
    actionMap.set(ACTION_ORDER_PIZZA, orderPizzaHandler);
    actionMap.set(ACTION_USER_DATA, userDataHandler);
    assistant.handleRequest(actionMap);
  }
);
