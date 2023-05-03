const express = require('express');
const router = express.Router();
const path = require('path');
router.get('/', function (req, res, next) {
    // Check user is alraedy authenticated
    if (req.session.user) {
        console.log('User already authenticated.');
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, "../../public/layouts/login.html"));
    }

});

module.exports = router;
