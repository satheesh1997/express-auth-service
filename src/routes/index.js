const express = require('express');
const middlewares = require('../middlewares');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', middlewares.sessionAuthentication, (req, res, next) =>{
    res.render('login_page', {})
})

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