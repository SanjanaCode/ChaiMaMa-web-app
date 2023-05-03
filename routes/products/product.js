// const { query } = require('express');
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const query = require('../../utilities/query').query;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function () {
        try {

            // Get product name to search for
            let id = req.query.id;
            let name = req.query.name;
            let price = req.query.price;
            let desc = req.query.desc;
            let cat = req.query.cat;

            // Check if parameters are present
            if (!id || !name || !price) {
                res.status(400).send('Missing parameters');
            }

            // Get product images
            let result = await query(
                `
                SELECT productImageURL, productImage 
                FROM Product 
                WHERE productId = @productId
                `,
                {
                    productId: id
                }
            );

            // Check if product exists
            if (result.recordset.length === 0) {
                res.status(400).send('Product does not exist');
            }

            let imageLink = result.recordset[0].productImageURL;
            let binaryImage = result.recordset[0].productImage;


            let image_ref = '';
            let thumbnail = '';
            // Check if image url is present
            if (imageLink) {
                image_ref += `
                    <img id= "image_0" class="ref-image active rounded-img" src="${imageLink}" alt= "Product Image" data-reflow-preview-type="image" />
                `;
                thumbnail += `
                    <img id= "thumb_0" class="ref-image active rounded-img" src="${imageLink}" alt= "Product Image" data-reflow-preview-type="image" onclick="switchMainImage(0);" />
                `;
            } else if (binaryImage) {
                // If there is already an image, we don't set the second image as active
                let isActive = imageLink ? '' : 'active';
                image_ref += `
                    <img id= "image_1" class="ref-image ${isActive} rounded-img" src="/displayImage?id=${id}" alt= "Product Image" data-reflow-preview-type="image" />
                `;
                thumbnail += `
                    <img id= "thumb_1" class="ref-image ${isActive} rounded-img" src="/displayImage?id=${id}" alt= "Product Image" data-reflow-preview-type="image" onclick="switchMainImage(1)"/>
                `;
            }

            // If there are no images, set default image
            if (image_ref.length == 0) {
                image_ref += `
                    <img class="ref-image active rounded-img" src="/images/placeholder.jpeg" alt= "Product Image" data-reflow-preview-type="image" />
                `;
            }


            res.render('layouts/product', {
                product_name: name,
                category: cat,
                price: Number(price).toFixed(2),
                productId: id,
                productDesc: desc,
                image_ref: image_ref,
                thumbnail: thumbnail,
                main_menu_ref: req.session.user ? "/account" : "/login",
                main_menu: req.session.user ? "Account" : "Login",
                logout: req.session.user ? "<a href='/logout'>Logout</a>" : null,
                admin_portal: (req.session.user && req.session.user.info.isAdmin) ? "<a href='/admin/customer'>Admin Portal</a>" : null,
                layout: false,
            });
        } catch (err) {
            console.dir(err);
            res.status(500).send('Internal server error');
        }
    })();
});

module.exports = router;




