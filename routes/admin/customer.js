const express = require('express');
const router = express.Router();
const query = require('../../utilities/query').query;

router.get('/', async function (req, res, next) {

    // Check if the user is an admin
    if (!req.session.user || !req.session.user.info.isAdmin) {
        res.status(401).end();
        return;
    }

    var customerInfo = '';

    res.setHeader('Content-Type', 'text/html');

    // Get the product name to search for
    // let name = req.query.productName;
    // let condition = (name && name.length > 0) ? "WHERE LOWER(productName) LIKE '%" + name.toLowerCase() + "%'" : "";

    let customers = await query(`
        SELECT customerId, concat(firstName,' ', lastName) as fullName, email, phonenum, userid FROM customer
    `, null
    );

    for (let i = 0; i < customers.recordset.length; i++) {

        let customer = customers.recordset[i];

        customerInfo += `
            <tr>
                
                <td>${customer.customerId}</td>
                <td>${customer.fullName}</td>
                <td>${customer.email}</td>
                <td>${customer.phonenum}</td>
                <td>${customer.userid}</td>
            </tr>
        `;
    }

    res.render(
        'layouts/admin_customer',
        {
            customers: customerInfo,
            layout: false,
        }
    );
});

module.exports = router;
