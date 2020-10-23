const bCrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../models/user.js');

const router = express.Router();

router.post('/create', (req, res, cb) => {
    const userData = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    };
    Users.create(userData, (err, user) => {
        if (err) return res.status(400).json(err);
        return res.status(201).json({
            _id: user._id
        })
    });
});

router.post('/login', (req, res, cb) => {
    const {
        body: {
            email,
            password
        }
    } = req;
    Users.findByEmail(email, (err, user) => {
        if (err) return res.status(400).json(err);
        if (user == null) return res.status(404).json(); 
        if (!bCrypt.compareSync(password, user.password)) return res.status(401).json();
        // if (!user.isActive) return res.status(401).json({'message': 'User is not activated'});

        // update the last login time
        user.updateLastLogin();

        // return the jwt token in the response
        const userData = {
            _id: user.id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            isActive: user.isActive,
            lastLogin: user.lastLogin
        }

        // generate a jwt token and send in response
        let token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        return res.json({'token': token});
    });

});

module.exports = router;