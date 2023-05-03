const express = require('express');
const router = express.Router();
const { query } = require('../../utilities/query');

router.get('/', async function (req, res, next) {
    var productInfo = '';

    res.setHeader('Content-Type', 'text/html');

    // Get the product name to search for
    let productName = req.query.productName;
    let products = false;
    let sql = `SELECT * FROM product JOIN category ON product.categoryId = category.categoryId`;
    if (productName && productName.length > 0) {
        console.log("Searched Name: " + productName);
        products = await query(sql +
            ` WHERE LOWER(productName) LIKE @productName`,
            {
                productName: `%${productName}%`
            }
        );
    } else {
        products = await query(sql);
    }


    for (let product of products.recordset) {
        let imageLink = product.productImageURL;
        let binaryImage = product.productImage;
        let src = '/images/placeholder.jpeg';
        if (imageLink) {
            src = imageLink;
        }
        else if (binaryImage) {
            src = `/displayImage?id=${product.productId}`;
        }

        productInfo += `
        <a class="ref-product" href="/product?id=${product.productId}&name=${product.productName}&price=${product.productPrice}&desc=${product.productDesc}&cat=${product.categoryName}">
            <img class="ref-image" src=${src} loading="lazy" />
            <div class="ref-product-data">
                <div class="ref-product-info">
                    <h5 class="ref-name">${product.productName}</h5>
                </div>
                <p class="ref-price">$${Number(product.productPrice).toFixed(2)}</p>
            </div>
        </a>
        `;
    }

    res.render(
        'layouts/listprod',
        {
            products: productInfo,
            main_menu_ref: req.session.user ? "/account" : "/login",
            main_menu: req.session.user ? "Account" : "Login",
            logout: req.session.user ? "<a href='/logout'>Logout</a>" : null,
            admin_portal: (req.session.user && req.session.user.info.isAdmin) ? "<a href='/admin/customer'>Admin Portal</a>" : null,
            layout: false,
        }
    );
});

module.exports = router;