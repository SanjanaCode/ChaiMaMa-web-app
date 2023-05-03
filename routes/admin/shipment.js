const express = require('express');
const router = express.Router();
const query = require('../../utilities/query').query;

router.get('/', async function (req, res, next) {
    // Check if the user is an admin
    if (!req.session.user || !req.session.user.info.isAdmin) {
        res.status(401).end();
        return;
    }

    var shipmentInfo = '';

    res.setHeader('Content-Type', 'text/html');

    // Get the product name to search for
    // let name = req.query.productName;
    // let condition = (name && name.length > 0) ? "WHERE LOWER(productName) LIKE '%" + name.toLowerCase() + "%'" : "";

    let shipments = await query(`
        SELECT shipmentId, orderId, shipmentDate, shipmentDesc, warehouseId FROM shipment
    `, null
    );

    for (let i = 0; i < shipments.recordset.length; i++) {

        let shipment = shipments.recordset[i];

        productInfo += `
            <tr>
                <td>${shipment.shipmentId}</td>
                <td>${shipment.orderId}</td>
                <td>${shipment.shipmentDate}
                <td>${shipment.shipmentDesc}</td>
                <td>${shipment.warehouseId}</td>
            </tr>
        `;
    }

    res.render(
        'layouts/admin_shipment',
        {
            shipments: shipmentInfo,
            layout: false,
        }
    );
});

module.exports = router;
