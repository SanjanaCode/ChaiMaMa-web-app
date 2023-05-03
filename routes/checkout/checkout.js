const express = require('express');
const router = express.Router();
const path = require('path');
const { getProductImageURL } = require('../../utilities/query');

/**
 * Default ship fee. Default to 10.
 */
var shipFee = 10;

router.get('/', async function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    // Get cart information
    let cart = req.session.productList;
    if (cart && req.session.productCount > 0) {
        let products = '';
        let subTotal = 0;
        for (let productId in cart) {
            let product = cart[productId];

            let imageURL = await getProductImageURL(productId);
            products += `
            <div class="ref-products">
                <div class="ref-product">
                    <div class="ref-product-col">
                        <img class="ref-product-photo"
                            src="${imageURL}"
                            alt="Dermentum Quisque">
                        <div class ="ref-product-name">${product.name}</div>
                        <div class ="ref-product-secondary">${Number(product.price).toFixed(2)} x ${product.quantity}</div>
                    </div>
                <div class="ref-product-total">$${(Number(product.price) * Number(product.quantity)).toFixed(2)}</div>
            </div>
        </div>
            `;
            subTotal += Number(product.price) * Number(product.quantity);
        }

        let options = {
            layout: false,
            products: products,
            subTotal: subTotal.toFixed(2),
            shipFee: shipFee.toFixed(2),
            total: (subTotal + shipFee).toFixed(2),
            main_menu_ref: req.session.user ? "/account" : "/login",
            main_menu: req.session.user ? "Account" : "Login",
            logout: req.session.user ? "<a href='/logout'>Logout</a>" : null,
            admin_portal: (req.session.user && req.session.user.info.isAdmin) ? "<a href='/admin/customer'>Admin Portal</a>" : null,
        };

        if (req.session.user) {
            let user = req.session.user;
            options.id = user.info.customerId;
            options.email = user.info.email;
            options.phone = user.info.phonenum;
        }

        res.render('layouts/checkout', options);
    } else {
        res.render('layouts/empty_cart', {
            layout: false,
            main_menu_ref: req.session.user ? "/account" : "/login",
            main_menu: req.session.user ? "Account" : "Login",
            logout: req.session.user ? "<a href='/logout'>Logout</a>" : null,
            admin_portal: (req.session.user && req.session.user.info.isAdmin) ? "<a href='/admin/customer'>Admin Portal</a>" : null,
        });
    }


});


module.exports = router;
