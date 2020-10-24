const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

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

router.get('/authpage', (req, res, next) =>{
    console.log("hi");
    res.render('login_page', {})
})


module.exports = router;