const express = require('express');
const router = express.Router();

router.post('/', function (req, res) {
    // If the product list isn't set in the session,
    // create a new list.
    let productList = false;
    if (!req.session.productList) {
        productList = {};
        req.session.productCount = 0; // Distinct products in cart
        req.session.productList = productList;
    } else {
        productList = req.session.productList;
    }
    // Add the product to the list.
    // Get product information
    let id = req.body.id;
    let name = req.body.name;
    let price = req.body.price;
    let quantity = req.body.quantity;
    if (!id || !name || !price || !quantity) {
        res.status(400).send('Missing product information.');
    } else {
        // Update quantity if product already exists in the list.
        if (productList[id]) {
            if (quantity > 0) {
                if (req.body.add) {
                    productList[id].quantity += Number(quantity);
                } else {
                    productList[id].quantity = Number(quantity);
                }
            }
            else {
                delete productList[id];
                req.session.productCount--;
            }
        } else {
            productList[id] = {
                "id": id,
                "name": name,
                "price": price,
                "quantity": Number(quantity)
            };
            req.session.productCount++;
        }

        // Calculate subtotal
        let subTotal = 0;
        for (let productId in productList) {
            let product = productList[productId];
            subTotal += Number(product.price) * Number(product.quantity);
        }

        res.status(200).send({
            added: productList[id],
            subTotal: subTotal,
        });
    }
});

module.exports = router;
