const express = require('express');
const router = express.Router();
const path = require('path');
const { getProductImageURL } = require('../../utilities/query');


router.get('/', async function (req, res) {

    let productList = req.session.productList;
    if (productList && req.session.productCount > 0) {
        let products = '';
        let subTotal = 0;
        for (let productId in productList) {
            let product = productList[productId];

            let imageURL = await getProductImageURL(productId);
            // Create a product element for displaying
            products += `
            <div id='product_${product.id}'>
                <div class="ref-product">
                <div class="ref-product-col">
                    <div class="ref-product-wrapper"><img class="ref-product-photo"
                            src="${imageURL}"
                            alt="${product.name}" />
                        <div class="ref-product-data">
                            <div class="ref-product-info">
                                <div id='product_name_${product.id}' class="ref-product-name">${product.name}</div>
                                <!--  <div class="ref-product-category">Tea</div> -->
                                <div id='product_id_${product.id}' class="ref-product-id" hidden>${product.id}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ref-price-col">
                    <div id='price_${product.id}' class="ref-product-price">$${product.price}</div>
                </div>
                <div class="ref-quantity-col">
                    <div class="ref-product-quantity">
                        <div class="ref-quantity-widget">
                            <div class="ref-decrease" onclick='updateQuantity(${product.id}, false, false, false);'>-</div>
                            <input id='quantity_${product.id}' type="text" onchange="updateQuantity(${product.id}, false, false, true);" value=${product.quantity} />
                            <div class="ref-increase" onclick='updateQuantity(${product.id}, true, false, false);'>+</div>
                        </div>
                        <div class="ref-product-remove" onclick='updateQuantity(${product.id}, false, true);'>Remove</div>
                    </div>
                </div>
                <div class="ref-total-col">
                    <div class="ref-product-total">
                        <div id='total_${product.id}' class="ref-product-total-sum">$${(Number(product.quantity) * Number(product.price)).toFixed(2)}</div>
                    </div>
                </div>
                </div>
            </div>
            `;

            // Computing the subtotal
            subTotal += product.quantity * product.price;

        }

        res.render('layouts/showcart', {
            layout: false,
            products: products,
            subTotal: subTotal.toFixed(2),
            main_menu_ref: req.session.user ? "/account" : "/login",
            main_menu: req.session.user ? "Account" : "Login",
            logout: req.session.user ? "<a href='/logout'>Logout</a>" : null,
            admin_portal: (req.session.user && req.session.user.info.isAdmin) ? "<a href='/admin/customer'>Admin Portal</a>" : null,
        });
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
