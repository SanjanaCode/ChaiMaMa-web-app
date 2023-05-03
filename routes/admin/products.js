const express = require('express');
const router = express.Router();
const query = require('../../utilities/query').query;

router.get('/', async function (req, res, next) {
    // Check if the user is an admin
    if (!req.session.user || !req.session.user.info.isAdmin) {
        res.status(401).end();
        return;
    }

    var productInfo = '';

    res.setHeader('Content-Type', 'text/html');
    let products = await query(`
        SELECT productId, productName, productDesc, productPrice, productImage, productImageURL FROM product
    `, null
    );

    for (let i = 0; i < products.recordset.length; i++) {

        let product = products.recordset[i];

        let imageSrc = false;
        if (product.productImageURL || product.productImage) {
            imageSrc = product.productImageURL || `/displayImage?id=${product.productId}`;
        } else {
            imageSrc = '/images/placeholder.jpeg';
        }
        console.log(imageSrc);

        productInfo += `
            <tr id = ${product.productId} contenteditable="true" class = "contenteditable">
                <td contenteditable="false">${product.productId}</td>
                <td class="productName">${product.productName}</td>
                <td class="productDesc">${product.productDesc}</td>
                <td class="productPrice">${product.productPrice}</td>
                <td class="productImage"><img src="${imageSrc}" height="100%" width="100%" alt="Product Image" data-reflow-preview-type="image" /></td>
            </tr>
        `;
    }

    res.render(
        'layouts/admin_product',
        {
            products: productInfo,
            layout: false,
        }
    );
});

module.exports = router;
