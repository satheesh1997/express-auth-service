const bCrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const middlewares = require('../middlewares');
const User = require('../models/user');

const router = express.Router();

// serviceAuth required routes
router.post('/create', middlewares.machineAuthentication, (req, res, next) => {
    const userData = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    };

    User.create(userData, (err, user) => {
        if (err) next(err);
        else return res.status(201).json({_id: user._id});
    });
});

router.get('/:userID', middlewares.machineAuthentication, (req, res, next) => {
    const {
        params: {
            userID
        }
    } = req;

    if (!mongoose.Types.ObjectId.isValid(userID)) return res.sendStatus(404);

    User.findById(userID, (err, user) => {
        if (err) next(err);
        else {
            if (user == null) return res.sendStatus(404);
            return res.json(user.toJson());
        }
    })
});

// userAuth required routes
router.post('/login', middlewares.userAuthentication, (req, res, next) => {
    if (req.user) {
        return res.sendStatus(409);
    }
    const {
        body: {
            email,
            password
        }
    } = req;

    User.findByEmail(email, (err, user) => {
        if (err) next(err);
        else {
            if (user == null) return res.sendStatus(404);
            if (!bCrypt.compareSync(password, user.password)) return res.sendStatus(401);

            // update the last login time of the user and return jwt in response
            user.updateLastLogin((err, user) => {
                if (err) next(err);
                else {
                    // sign the payload and return the token in response
                    let token = jwt.sign(user.toJson(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

                    // set jwt token in the cookie
                    res.cookie(
                        '_token',
                        token,
                        {
                            domain: process.env.DOMAIN || 'localhost',
                            secure: process.env.SECURE,
                            expires: new Date(Date.now() + 85500000) // cookie will expire 15mins before the token expires
                        }
                    );
                    return res.json({'token': token});
                }
            });
        }
    });
});

router.post('/change-password', middlewares.userAuthentication, (req, res, next) => {
    const {
        user: {
            _id
        },
        body: {
            password,
            confirm_password
        }
    } = req;

    if (!password || !confirm_password) return res.status(400).json({'error': 'Provide both password & confirm password'});
    if (password !== confirm_password) return res.status(400).json({'error': 'Password\'s don\'t match'});

    User.findById(_id, (err, user) => {
        if (err) next(err);
        else {
            if (user == null) return res.sendStatus(404);
            user.setPassword(confirm_password, (err, user) => {
                if (err) next(err);
                else {
                    return res.sendStatus(201);
                }
            })
        }
    })
});

module.exports = router;