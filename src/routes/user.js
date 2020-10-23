const bCrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Users = require('../models/user.js');

const router = express.Router();

router.post('/create', (req, res, next) => {
    const userData = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    };

    Users.create(userData, (err, user) => {
        if (err) next(err);
        else return res.status(201).json({_id: user._id});
    });
});

router.post('/login', (req, res, next) => {
    const {
        body: {
            email,
            password
        }
    } = req;

    Users.findByEmail(email, (err, user) => {
        if (err) next(err);
        else {
            if (user == null) return res.status(404).json();
            if (!bCrypt.compareSync(password, user.password)) return res.status(401).json();

            // update the last login time of the user and return jwt in response
            user.updateLastLogin((err, user) => {
                if (err) next(err);
                else {
                    // sign the payload and return the token in response
                    let token = jwt.sign(user.toJson(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                    return res.json({'token': token});
                }
            });
        }
    });
});

router.get('/:userID', (req, res, next) => {
    const {
        params: {
            userID
        }
    } = req;

    if (!mongoose.Types.ObjectId.isValid(userID)) return res.status(404).json();

    Users.findById(userID, (err, user) => {
        if (err) next(err);
        else {
            if (user == null) return res.status(404).json();
            return res.json(user.toJson());
        }
    })
})

module.exports = router;