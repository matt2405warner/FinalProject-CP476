const db = require('../database');
module.exports = function(io) {
    var user = io.of('/');

    user.on('connection', (socket) => {
        socket.on('signIn', (newUser) => {
            console.log('new user');
            db.admin.auth().signInWithEmailAndPassword(newUser.email, newUser.password)
            .then(() => {
                socket.emit('sign in result', {
                    passed: true,
                    errorCode: null,
                    errorMessage: null
                });
            })
            .catch((error) => {
                socket.emit('sign in result', {
                    passed: false,
                    errorCode: error.errorCode,
                    errorMessage: error.message
                });
            });
        });
        socket.on('signUp', (newUser) => {
            db.admin.auth().createUserWithEmailAndPassword(newUser.email, password.email)
            .then(() => {
                socket.emit('sign up result', {
                    passed: true,
                    errorCode: null,
                    errorMessage: null
                });
            })
            .catch((error) => {
                socket.emit('sign up result', {
                    passed: false,
                    errorCode: error.errorCode,
                    errorMessage: error.message
                });
            });
        });
        socket.on('signOut', () => {
            db.admin.auth().signOut()
            .then(() => {
                socket.emit('sign out result', {
                    passed: true,
                    errorCode: null,
                    errorMessage: null
                })
            }).catch((error) => {
                socket.emit('sign out result', {
                    passed: false,
                    errorCode: null,
                    errorMessage: error.message
                })
            });
        });
    });

    return user;
}