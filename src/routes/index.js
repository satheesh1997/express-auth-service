const constants = require('../constants');
const express = require('express');
const jwt = require("jsonwebtoken");
const middlewares = require('../middlewares');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');

router.get('/', middlewares.sessionAuthentication, (req, res, next) =>{
    res.render('login_page', {})
});

router.post('/forgot-password/', (req, res, next) => {
    const {
        body: {
            email
        }
    } = req;

    User.findByEmail(email, (err, user) => {
        if (err) return next(err);
        if (user == null) return res.sendStatus(404);

        const confirmToken = jwt.sign(
            {'_id': user._id},
            constants.FORGOT_PASSWORD_SECRET, 
            { expiresIn: '5m' }
        );
        const forgotPasswordURL = `${process.env.PROTOCOL}://${process.env.DOMAIN}/change-password/${confirmToken}/`;

        if (process.env.NODE_ENV === "DEV") console.log(forgotPasswordURL);

        return res.sendStatus(200);
    });
});

router.get('/logout/', (req, res, next) => {
    res.cookie(
        '_token',
        '',
        {
            domain: process.env.TOKEN_DOMAIN,
            secure: process.env.PROTOCOL === "http" ? false : true,
            expires: new Date(Date.now()-100)
        }
    );
    return res.redirect('/');
});

router.get('/status', (req, res, next) => {
    const mongoStateMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    }

    res.json({
        "server": {
            "state": "running"
        },
        "mongoDB": {
            "state": mongoStateMap[mongoose.connection.readyState]
        }
    });
});


module.exports = router;