const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.database();

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
