const express = require('express');
const router = express.Router();
const moment = require('moment');
const query = require('../../utilities/query').query;

router.get('/', async function (req, res, next) {
    // Check if the user is an admin
    if (!req.session.user || !req.session.user.info.isAdmin) {
        res.status(401).end();
        return;
    }

    var orderInfo = '';

    res.setHeader('Content-Type', 'text/html');

    // Get the product name to search for
    // let name = req.query.productName;
    // let condition = (name && name.length > 0) ? "WHERE LOWER(productName) LIKE '%" + name.toLowerCase() + "%'" : "";

    let orders = await query(`
        SELECT o.orderId, orderDate, customerId, shipmentId, totalAmount FROM ordersummary o left join shipment s on o.orderId = s.orderId 
    `, null
    );

    let totalSales = 0;
    let totalOrders = orders.recordset.length;

    for (let i = 0; i < orders.recordset.length; i++) {

        let order = orders.recordset[i];
        let status = "";

        totalSales += order.totalAmount;

        if (order.shipment == null)
            status = "Not shipped"
        else
            status = "Shipped"
        orderInfo += `
            <tr>
                <td>${order.orderId}</td>
                <td>${moment(order.orderDate).format('YYYY-mm-d HH:m:s')}</td>
                <td>${order.customerId}</td>
                <td>${order.totalAmount}</td>
                <td>${status}</td>
            </tr>
        `;
    }

    res.render(
        'layouts/admin_order',
        {
            orders: orderInfo,
            totalOrders: totalOrders,
            totalSales: totalSales.toFixed(2),
            layout: false,
        }
    );
});

module.exports = router;
