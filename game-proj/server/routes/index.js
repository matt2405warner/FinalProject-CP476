const express = require('express');
const router = express.Router();
const db = require('../database/index.js');

router.post('/api/signin', (req, res) => {
    db.auth.signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((user) => {
        let stringData = JSON.stringify(user.providerData);
        let userData = JSON.parse(stringData);
        res.json(userData[0]); 
    })
    .catch((error) => {
        res.status(400).json(error);
    });
});

router.post('/api/signup', (req, res) => {
    db.auth.createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((user) => {
        let stringData = JSON.stringify(user.providerData);
        let userData = JSON.parse(stringData);
        res.json(userData[0]); 
    })
    .catch((error) => {
        res.status(400).json(error);
    });
});

module.exports = router;