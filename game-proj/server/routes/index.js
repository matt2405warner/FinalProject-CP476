const express = require('express');
const router = express.Router();
const db = require('../database/index.js');

router.post('/api/signin', (req, res) => {
    console.log(req.body);
    db.auth.signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((user) => {
        let stringData = JSON.stringify(user.providerData);
        let userData = JSON.parse(stringData);
        res.setHeader('Content-Type', 'application/json');
        res.send(userData[0]); 
    })
    .catch((error) => {
        res.send(error);
    });
});

router.post('/api/signup', (req, res) => {
    db.auth.createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((user) => {
        let stringData = JSON.stringify(user.providerData);
        let userData = JSON.parse(stringData);
        res.setHeader('Content-Type', 'application/json');
        res.send(userData[0]); 
    })
    .catch((error) => {
        res.send(error);
    });
});

module.exports = router;