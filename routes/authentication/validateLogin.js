const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../utilities/validators');
const { body, validationResult } = require('express-validator');
const { hash } = require('../../utilities/security');
const { User, Admin } = require('./user');
const { is } = require('express/lib/request');

router.post('/',
    [
        body('username').exists({ checkNull: true, checkFalsy: true }).not().isEmpty(),
        body('password').exists({ checkNull: true, checkFalsy: true }).not().isEmpty(), // Check if username is non-empty and valid
    ],
    function (req, res) {
        (async function () {
            console.log('Checking user...');
            // If authentication fails or database connection errors, user is consider not authenticated.
            try {
                // Checking if the request is for an admin access
                let isAdmin = /^\w+.chaimama.admin$/.test(req.body.username);
                console.log('isAdmin: ' + isAdmin);

                // Check system for the requested user with posted information
                let authenticated = await isAuthenticated(req.body.username, hash(req.body.password), isAdmin);

                // Return error if not authenticated (Check out http error codes 4xx!)
                if (!authenticated) {
                    res.status(401).send('Authentication failed.');
                } else {
                    // Create an object representing the user
                    let user = isAdmin ? new Admin(req.body.username, hash(req.body.password))
                        : new User(req.body.username, hash(req.body.password));

                    // Add the user as a property to the current session after self-intializing
                    req.session.user = await user.intializeInfo();

                    // If remember is set to true, set session maxAge to a large number (default a year)
                    if (req.body.remember === "true") {
                        req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                    }

                    // Return success status
                    res.status(200).send({
                        isAdmin: isAdmin
                    });
                }
            } catch (err) {
                console.log(err);
                res.status(500).send('Database connection error.');
            }

        })();
    }
);

module.exports = router;
