const firebase = require('firebase');

// fetch the service account key JSON file contents
var config = {
    apiKey: "AIzaSyBMhTKcsx1mBtRAASDy_YvoTNQk9yohItU",
    authDomain: "multigame-71efd.firebaseapp.com",
    databaseURL: "https://multigame-71efd.firebaseio.com",
    storageBucket: "multigame-71efd.appspot.com",
    messagingSenderId: "35095680642"
  };
firebase.initializeApp(config);

module.exports = {
    database: firebase.database(),
    auth: firebase.auth()
}