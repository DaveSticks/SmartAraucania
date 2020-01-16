const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  console.log("Se ejecutó la helloWorld")
  response.send("Hello from Firebase!");
});

exports.removeUser = functions.database.ref('/usuarios/{userId}').onDelete((snapshot, context) => {
  console.log("Se eliminó el usuario " + snapshot.key)

  admin.auth().deleteUser(snapshot.key)
  .then(function() {
    console.log('Usuario eliminado con éxito');
  })
  .catch(function(error) {
    console.log('Error al eliminar el usuario:', error);
  });
});

exports.addUser = functions.database.ref('/usuarios/{userId}').onCreate((snap, context) => {
  console.log("Se agregó el usuario con ID: " + snap.key)
  console.log(snap.key)
})
// Todo este codigo corre en el servidor de Firebase
