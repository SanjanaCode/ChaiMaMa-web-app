const express = require('express');
const router = express.Router();
const moment = require('moment');
const query = require('../../utilities/query').query;

router.get('/', async function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    /**
    Useful code for formatting currency:
        let num = 2.87879778;
        num = num.toFixed(2);
    **/

    /** Write query to retrieve all order headers **/

    /** For each order in the results
            Print out the order header information
            Write a query to retrieve the products in the order
s
            For each product in the order
                Write out product information 
    **/

    /** Create connection, and validate that it connected successfully **/
    try {
        let orders = await query(`
        SELECT orderId, orderDate, C.customerId AS cusId, CONCAT(C.firstName, ' ', C.lastName) AS name, totalAmount
        FROM customer C JOIN ordersummary O ON C.customerId = O.customerId`,
            null
        );
        res.write(`
<html>
<head>
<title>ChaiMaMa Order List</title>
</head>
<body>
    <style>
        table, th, td {
            border: 1px solid black;
        }
    </style>
    <h1>Order List</h1>
    <table>
        <tr>
            <th>Order Id</th>
            <th>Order Date</th>
            <th>Customer Id</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
        </tr>
        `);
        for (let i = 0; i < orders.recordset.length; i++) {
            let order = orders.recordset[i];
            // console.dir(order);
            res.write(`
        <tr>
            <td>${order.orderId}</td>
            <td>${moment(order.orderDate).format('YYYY-mm-d HH:m:s')}</td>
            <td>${order.cusId}</td>
            <td>${order.name}</td>
            <td>${order.totalAmount.toFixed(2)}</td>
        </tr>
            `);

            // Get the products in the order
            let products = await query(`
            SELECT productId, quantity, price
            FROM orderproduct
            WHERE orderId = @orderId
            `, {
                orderId: order.orderId
            });

            res.write(`
        <tr align="right">
            <td colspan="5">
                <table>
                    <tr>
                        <th>Product Id</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
            `);

            for (let j = 0; j < products.recordset.length; j++) {
                let product = products.recordset[j];
                res.write(`
                    <tr>
                        <td>${product.productId}</td>
                        <td>${product.quantity}</td>
                        <td>$${product.price.toFixed(2)}</td>
                    </tr>
                `);
            }
            res.write(`
                </table>
            </td>
        </tr>
            `);
        }
        res.write(`
    </table>
</body>
</html>
        `);
    } catch (err) {
        res.write("<h1>Error connecting to database: " + err + "</h1>");
        console.dir(err);
    }
    res.end();
});

module.exports = router;
