const express = require('express');
const router = express.Router();
const { TransactionError } = require('mssql');
const { NotEnoughInventory, ProductNotFound, OrderEmptyError } = require('../../utilities/errors');
const { isValidOrder, shipmentProcssed } = require('../../utilities/validators');
const { updateShipment, query } = require('../../utilities/query');
const path = require('path');

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    // TODO: Get order id
    let orderId = req.query.orderId;

    if (orderId) {
        (async function () {
            // TODO: Check if valid order id
            let isValid = await isValidOrder(Number(orderId)) && !(await shipmentProcssed(Number(orderId)));
            let changes = [];
            if (isValid) {
                try {

                    // TODO: Retrieve all items in order with given id
                    let orderedItems = await query(
                        `
                        SELECT OS.orderId AS orderId, productId, quantity, orderDate
                        FROM ordersummary AS OS, orderproduct AS OP
                        WHERE OS.orderId = OP.orderId AND OS.orderId = @orderId
                        `,
                        { orderId: orderId }
                    );

                    // Run transaction for each item
                    // TODO: Start a transaction
                    // Might throw an error if a rollback is triggered or any sql-related errors occur
                    if (orderedItems.recordset.length > 0) {
                        await updateShipment(orderedItems.recordset, changes);
                    } else {
                        throw new OrderEmptyError(orderId);
                    }

                    res.status(500).sendFile(path.join(__dirname, '../../public/layouts/success.html'));
                } catch (err) {
                    if (err instanceof TransactionError) {
                        res.status(500);
                    } else if (err instanceof NotEnoughInventory) {
                        res.status(500);
                    } else if (err instanceof ProductNotFound || err instanceof OrderEmptyError) {
                        res.status(400);
                    } else {
                        res.status(500);
                    }
                    console.dir(err);
                    res.status(500).sendFile(path.join(__dirname, '../../public/layouts/error.html'));
                }
            } else {
                res.status(404).end();
            }
        })();
    } else {
        res.status(404).end();
    }
});



module.exports = router;
