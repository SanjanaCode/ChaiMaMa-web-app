const express = require('express');
const router = express.Router();
const { updateAccount, getOrderHistory, getProductInOrder } = require('../../utilities/query');
const { body } = require('express-validator');
const moment = require('moment');

// // Mock user used for testing
// let mockUser = {
//     customerId: 1,
//     firstName: "John",
//     lastName: "Smith",
//     email: "jsmith@gmail.com",
//     phoneNum: "2505551234",
//     address: "3174 University Way",
//     city: "Kelowna",
//     state: "BC",
//     postalCode: "V1V1V8",
//     country: "Canada"
// }

router.get('/', async function (req, res, next) {

    // If the current session has a user property, we have an authenticated user.
    let authenticated = req.session.user != undefined;

    try {
        if (authenticated) {
            // Define content type in http response message
            res.setHeader('Content-Type', 'text/html');

            let user = req.session.user;

            // Get order history
            let historyResults = await getOrderHistory(user.info.customerId);

            // Add order history to the orderHistory variable.
            let orderHistory = "";
            console.log(historyResults);

            for (let historyResult of historyResults) {
                // Append header
                orderHistory += `
                <div class='order-item'>
                    <div class="row order-header">
                        <div class="col-4">
                            <span class="title">ORDER PLACED</span><br><span class="value">${moment(historyResult.orderDate, "YYYY-MM-DD hh:m:s").format("MMMM DD, YYYY")}</span>
                        </div>
                        <div class="col-3">
                            <span class="title">TOTAL</span><br><span class="value">CDN$ ${Number(historyResult.totalAmount).toFixed(2)}</span>
                        </div>
                        <div class="col-3">
                            <span class="title">SHIP TO</span><br><span class="value">${historyResult.shiptoPostalCode ? historyResult.shiptoPostalCode : "Unknown"}</span>
                        </div>
                        <div class="col-2">
                            <span class="title">ORDER #${historyResult.orderId}</span>
                        </div>
                    </div>
                    <div class="order-list">
                `;

                console.log(historyResult);
                // Get the products that were in each order
                let orderedProducts = await getProductInOrder(historyResult.orderId);

                for (let orderProduct of orderedProducts) {

                    // Get the image source
                    let imageSrc = false;

                    if (orderProduct.productImageURL || orderProduct.productImage) {
                        imageSrc = orderProduct.productImageURL || "/displayImage?id=" + orderProduct.productId;
                    } else {
                        imageSrc = "/images/placeholder.jpeg";
                    }


                    orderHistory += `   
                        <div class="row order-list-item">
                            <div class="col-2">
                                <img src="${imageSrc}" height="100%" width="100%"
                                    style="border-radius: 6px;">
                            </div>
                            <div class="col-4">
                                <span class="title">Product Detail</span>
                                <br>
                                <a href="/listprod?productName=${orderProduct.productName}"><span class="product-name">${orderProduct.productName}</span></a>
                                <br><span class="category">${orderProduct.categoryName}</span>
                            </div>
                            <div class="col-3">
                                <span class="title">Quantity</span>
                                <br><span class="quantity">${orderProduct.quantity}</span>
                            </div>
                            <div class="col-3">
                                <span class="title">Price</span>
                                <br>
                                <span class="price">$${Number(orderProduct.price).toFixed(2)}</span>
                            </div>
                        </div>

                    `;
                }

                // Add closing tags
                orderHistory += `
                    </div>
                </div>
                `;
            }

            console.log(req.session.user && req.session.user.info.isAdmin);

            // Render the template
            res.render('layouts/account', {
                title: `Your account - ${user.info.firstName} ${user.info.lastName} `,
                firstName: user.info.firstName,
                lastName: user.info.lastName,
                email: user.info.email,
                phoneNum: user.info.phonenum,
                address: user.info.address,
                city: user.info.city,
                state: user.info.state,
                postalCode: user.info.postalCode,
                country: user.info.country,
                orderHistory: orderHistory,
                main_menu_ref: req.session.user ? "/account" : "/login",
                main_menu: req.session.user ? "Account" : "Login",
                logout: req.session.user ? "<a href='/logout'>Logout</a>" : null,
                admin_portal: (req.session.user && req.session.user.info.isAdmin) ? "<a href='/admin/customer'>Admin Portal</a>" : null,
                layout: false // This will not set a default layout (e.g. avoiding duplicate head/body tags)
            });
        } else { // Not authenticated? Redirect to login
            res.redirect("/login");
        }
    } catch (e) {
        console.dir(e);
        res.status(500).send();
    }
});

router.post("/update",
    [
        body("firstName").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
        body("lastName").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
        body("email").exists({ checkFalsy: true, checkNull: true }).not().isEmpty().isEmail(),
        body("phonenum").exists({ checkFalsy: true, checkNull: true }).not().isEmpty().isMobilePhone('any'),
        body("address").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
        body("city").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
        body("state").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
        body("postalCode").exists({ checkFalsy: true, checkNull: true }).not().isEmpty().isPostalCode('any'),
        body("country").exists({ checkFalsy: true, checkNull: true }).not().isEmpty(),
    ],
    async function (req, res) {
        console.log("BODY: ");
        console.log(req.body);

        // If authenticated
        if (req.session.user) {
            let user = req.session.user;
            let newInfo = {
                customerId: user.info.customerId,
                userid: user.info.userid,
                password: user.info.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phonenum: req.body.phonenum,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                postalCode: req.body.postalCode,
                country: req.body.country
            };
            try {
                // console.log(newInfo);
                let success = await updateAccount(newInfo);

                if (success) {
                    req.session.user.info = newInfo; // Update user property in current session
                }

                console.log("NEW INFO");
                console.log(req.session.user.info);

                res.status(success ? 200 : 500).end();
            } catch (e) {
                console.dir(e);
                res.status(500).end();
            }

        } else {
            // If not authenticated, return 401 (Check out http status code!)
            res.status(401).end();
        }

    });

module.exports = router;
