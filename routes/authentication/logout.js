const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {

    // Invalidate the session ID -> destroy the session
    // This appears to be equavalent to setting req.session.cookie.maxAge to 0
    if (req.session.user) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
                // Return status 500
                res.status(500).send();
            } else {
                // Return status code 200 to indicate success
                res.status(200).redirect('/login');
            }
        });
    } else {
        // If not authenticated, return status code 404 (no information found to logout)
        res.status(404).send();
    }
});

module.exports = router;
