DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS shipment;
DROP TABLE IF EXISTS productinventory;
DROP TABLE IF EXISTS warehouse;
DROP TABLE IF EXISTS orderproduct;
DROP TABLE IF EXISTS incart;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS ordersummary;
DROP TABLE IF EXISTS paymentmethod;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS admin;


CREATE TABLE customer (
    customerId          INT IDENTITY,
    firstName           VARCHAR(40),
    lastName            VARCHAR(40),
    email               VARCHAR(50),
    phonenum            VARCHAR(20),
    address             VARCHAR(50),
    city                VARCHAR(40),
    state               VARCHAR(20),
    postalCode          VARCHAR(20),
    country             VARCHAR(40),
    userid              VARCHAR(20),
    password            VARCHAR(256),
    PRIMARY KEY (customerId)
);

CREATE TABLE admin (
    adminId             INT IDENTITY,
    firstName            VARCHAR(40),
    lastName            VARCHAR(40),
    email               VARCHAR(50),
    phonenum            VARCHAR(20),
    userid              VARCHAR(20),
    password            VARCHAR(256),
    PRIMARY KEY (adminId)
);

CREATE TABLE paymentmethod (
    paymentMethodId     INT IDENTITY,
    paymentType         VARCHAR(20),
    paymentNumber       VARCHAR(30),
    paymentExpiryDate   DATE,
    customerId          INT,
    PRIMARY KEY (paymentMethodId),
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE ordersummary (
    orderId             INT IDENTITY,
    orderDate           DATETIME,
    totalAmount         DECIMAL(10,2),
    shiptoAddress       VARCHAR(50),
    shiptoCity          VARCHAR(40),
    shiptoState         VARCHAR(20),
    shiptoPostalCode    VARCHAR(20),
    shiptoCountry       VARCHAR(40),
    customerId          INT,
    PRIMARY KEY (orderId),
    FOREIGN KEY (customerId) REFERENCES customer(customerid)
        ON UPDATE CASCADE ON DELETE CASCADE 
);

CREATE TABLE category (
    categoryId          INT IDENTITY,
    categoryName        VARCHAR(50),    
    PRIMARY KEY (categoryId)
);

CREATE TABLE product (
    productId           INT IDENTITY,
    productName         VARCHAR(40),
    productPrice        DECIMAL(10,2),
    productImageURL     VARCHAR(100),
    productImage        VARBINARY(MAX),
    productDesc         VARCHAR(1000),
    categoryId          INT,
    PRIMARY KEY (productId),
    FOREIGN KEY (categoryId) REFERENCES category(categoryId)
);

CREATE TABLE orderproduct (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE incart (
    orderId             INT,
    productId           INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE warehouse (
    warehouseId         INT IDENTITY,
    warehouseName       VARCHAR(30),    
    PRIMARY KEY (warehouseId)
);

CREATE TABLE shipment (
    shipmentId          INT IDENTITY,
    orderId             INT,
    shipmentDate        DATETIME,   
    shipmentDesc        VARCHAR(100),   
    warehouseId         INT, 
    PRIMARY KEY (shipmentId),
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (orderId) REFERENCES ordersummary(orderId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE productinventory ( 
    productId           INT,
    warehouseId         INT,
    quantity            INT,
    price               DECIMAL(10,2),  
    PRIMARY KEY (productId, warehouseId),   
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (warehouseId) REFERENCES warehouse(warehouseId)
        ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE review (
    reviewId            INT IDENTITY,
    reviewRating        INT,
    reviewDate          DATETIME,   
    customerId          INT,
    productId           INT,
    reviewComment       VARCHAR(1000),          
    PRIMARY KEY (reviewId),
    FOREIGN KEY (customerId) REFERENCES customer(customerId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES product(productId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO category(categoryName) VALUES ('Green Tea');
INSERT INTO category(categoryName) VALUES ('Yellow Tea');
INSERT INTO category(categoryName) VALUES ('Wulong Tea');
INSERT INTO category(categoryName) VALUES ('Dark Green Tea');
INSERT INTO category(categoryName) VALUES ('Dark Tea');
INSERT INTO category(categoryName) VALUES ('White Tea');
INSERT INTO category(categoryName) VALUES ('Red Tea');
INSERT INTO category(categoryName) VALUES ('Black Tea');

INSERT product( categoryId, productDesc, productPrice) VALUES ( 1, '10 boxes x 20 bags',18.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (1,'24 - 12 oz bottles',19.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (2,'12 - 550 ml bottles',10.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (2,'48 - 6 oz jars',22.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (2,'36 boxes',21.35);
INSERT product( categoryId, productDesc, productPrice) VALUES (2,'12 - 8 oz jars',25.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (4,'12 - 1 lb pkgs.',30.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (2,'12 - 12 oz jars',40.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (5,'18 - 500 g pkgs.',97.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (6,'12 - 200 ml jars',31.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (3,'1 kg pkg.',21.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (3,'10 - 500 g pkgs.',38.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (4,'40 - 100 g pkgs.',23.25);
INSERT product( categoryId, productDesc, productPrice) VALUES (2,'24 - 250 ml bottles',15.50);
INSERT product( categoryId, productDesc, productPrice) VALUES (7,'32 - 500 g boxes',17.45);
INSERT product( categoryId, productDesc, productPrice) VALUES (5,'20 - 1 kg tins',39.00);
INSERT product( categoryId, productDesc, productPrice) VALUES (6,'16 kg pkg.',62.50);
INSERT product( categoryId, productDesc, productPrice) VALUES (7,'10 boxes x 12 pieces',9.20);
INSERT product( categoryId, productDesc, productPrice) VALUES (7,'30 gift boxes',81.00);

INSERT INTO warehouse(warehouseName) VALUES ('Main warehouse');
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (1, 1, 5, 18);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (2, 1, 10, 19);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (3, 1, 3, 10);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (4, 1, 2, 22);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (5, 1, 6, 21.35);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (6, 1, 3, 25);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (7, 1, 1, 30);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (8, 1, 0, 40);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (9, 1, 2, 97);
INSERT INTO productInventory(productId, warehouseId, quantity, price) VALUES (10, 1, 3, 31);

INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Arnold', 'Anderson', 'a.anderson@gmail.com', '204-111-2222', '103 AnyWhere Street', 'Winnipeg', 'MB', 'R3X 45T', 'Canada', 'arnold' , '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Bobby', 'Brown', 'bobby.brown@hotmail.ca', '572-342-8911', '222 Bush Avenue', 'Boston', 'MA', '22222', 'United States', 'bobby' , '69ff8042237aeef5ddf1ced10e851bc6104e1ebb15a304061dba43ea10106fa9');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Candace', 'Cole', 'cole@charity.org', '333-444-5555', '333 Central Crescent', 'Chicago', 'IL', '33333', 'United States', 'candace' , '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Darren', 'Doe', 'oe@doe.com', '250-807-2222', '444 Dover Lane', 'Kelowna', 'BC', 'V1V 2X9', 'Canada', 'darren' , '30c952fab122c3f9759f02a6d95c3758b246b4fee239957b2d4fee46e26170c4');
INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES ('Elizabeth', 'Elliott', 'engel@uiowa.edu', '555-666-7777', '555 Everwood Street', 'Iowa City', 'IA', '52241', 'United States', 'beth' , '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');

-- Admin (only 1 now)
INSERT INTO admin (firstName, lastName, email, phonenum, userid, password) VALUES ('Jill', 'Phan', 'hello_kitty@chaimama.org', '204-111-2222', 'jill.chaimama.admin', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');

-- Order 1 can be shipped as have enough inventory
DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (1, '2019-10-15 10:25:55', 91.70)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 1, 1, 18)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 2, 21.35)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 10, 1, 31);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-16 18:00:00', 106.75)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 5, 21.35);

-- Order 3 cannot be shipped as do not have enough inventory for item 7
DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (3, '2019-10-15 3:30:22', 140)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 6, 2, 25)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 7, 3, 30);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (2, '2019-10-17 05:45:11', 327.85)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 3, 4, 10)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 8, 3, 40)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 13, 3, 23.25)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 10, 2, 21.05)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 19, 4, 14);

DECLARE @orderId int
INSERT INTO ordersummary (customerId, orderDate, totalAmount) VALUES (5, '2019-10-15 10:25:55', 277.40)
SELECT @orderId = @@IDENTITY
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 5, 4, 21.35)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 19, 2, 81)
INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, 4, 3, 10);



---Modying the database with mock data(name, image, description)

UPDATE Product SET productName = 'Assam' where productId = 1;
UPDATE Product SET productName = 'Ceylon' where productId = 2;
UPDATE Product SET productName = 'Earl Grey' where productId = 3;
UPDATE Product SET productName = 'English Breakfast' where productId = 4;
UPDATE Product SET productName = 'Rose' where productId = 5;
UPDATE Product SET productName = 'Genmaicha' where productId = 6;
UPDATE Product SET productName = 'Dragon Well' where productId = 7;
UPDATE Product SET productName = 'Matcha' where productId = 8;
UPDATE Product SET productName = 'Sencha' where productId = 9;
UPDATE Product SET productName = 'White Tip' where productId = 10;
UPDATE Product SET productName = 'Frozen Peak' where productId = 11;
UPDATE Product SET productName = 'Baozhong' where productId = 12;
UPDATE Product SET productName = 'Silver Needle' where productId = 13;
UPDATE Product SET productName = 'Darjeeling' where productId = 14;
UPDATE Product SET productName = 'Chamomile' where productId = 15;
UPDATE Product SET productName = 'Ginger' where productId = 16;
UPDATE Product SET productName = 'Hibiscus' where productId = 17;
UPDATE Product SET productName = 'Peppermint' where productId = 18;
UPDATE Product SET productName = 'Rooibos' where productId = 19;

UPDATE Product set productImageURL = '/images/assam.jpg' where productId = 1;
UPDATE Product set productImageURL = '/images/ceylon.jpg' where productId = 2;
UPDATE Product set productImageURL = '/images/earlgrey.jpg' where productId = 3;
UPDATE Product set productImageURL = '/images/Englishbreakfast.jpg' where productId = 4;
UPDATE Product set productImageURL = '/images/rose.jpg' where productId = 5;
UPDATE Product set productImageURL = '/images/genmaicha.jpg' where productId = 6;
UPDATE Product set productImageURL = '/images/dragonwell.jpg' where productId = 7;
UPDATE Product set productImageURL = '/images/matcha.jpg' where productId = 8;
UPDATE Product set productImageURL = '/images/sencha.jpg' where productId = 9;
UPDATE Product set productImageURL = '/images/whitetip.jpg' where productId = 10;
UPDATE Product set productImageURL = '/images/frozenpeak.jpg' where productId = 11;
UPDATE Product set productImageURL = '/images/Baozhong.jpg' where productId = 12;
UPDATE Product set productImageURL = '/images/silverneedle.jpg' where productId = 13;
UPDATE Product set productImageURL = '/images/darjeeling.jpg' where productId = 14;
UPDATE Product set productImageURL = '/images/camo.jpg' where productId = 15;
UPDATE Product set productImageURL = '/images/ginger.jpg' where productId = 16;
UPDATE Product set productImageURL = '/images/hibiscus.jpg' where productId = 17;
UPDATE Product set productImageURL = '/images/peppermint.jpg' where productId = 18;
UPDATE Product set productImageURL = '/images/rooibos.jpg' where productId = 19;


UPDATE Product set productDesc = 'Assam tea is usually described as full bodied and strong with a malty flavor. Full bodied means that tea is rich and complex and is most often related to black tea.'  where productId = 1;
UPDATE Product set productDesc = 'Ceylon tea features bold flavor with hints of chocolate or spices.' where productId = 2;
UPDATE Product set productDesc = 'Earl Grey tea consists of black tea flavored with bergamot and/or citrus.' where productId = 3;
UPDATE Product set productDesc = 'English Breakfast tea tends to be full-bodied and may most closely resemble Assam or Ceylon black tea in flavor.' where productId = 4;
UPDATE Product set productDesc = 'Rose tea is made from the petals and buds of the rose bush. caffeine-free, a good source of hydration, rich in antioxidants, and may help relieve menstrual pain.' where productId = 5;
UPDATE Product set productDesc = 'Genmaicha has toasty, nutty flavor, thanks to the sugars and starch in the roasted rice.' where productId = 6;
UPDATE Product set productDesc = 'Dragon Well tea is a hand-roasted type of Chinese tea with a fresh, slightly sweet, slightly nutty, flavor profile.' where productId = 7;
UPDATE Product set productDesc = 'Macha is a Japanese-style tea and one of the most popular green teas around. It boasts a creamy, savory, and almost bittersweet flavor.' where productId = 8;
UPDATE Product set productDesc = 'Sencha is one of the most popular types of Japanese tea, which is usually savory, grassy, and slightly bitter and may carry a scent of melon or pine' where productId = 9;
UPDATE Product set productDesc = 'White Tip tea has a fruity, crisp finish.' where productId = 10;
UPDATE Product set productDesc = 'Frozen Peak tea has a nutty flavor with a smooth finish.' where productId = 11;
UPDATE Product set productDesc = 'Baozhong tea undergoes minimal processing and boasts a delicate, subtle flavor.' where productId = 12;
UPDATE Product set productDesc = 'Silver Needle tea is a rare tea made only from buds. It has a floral scent and sweet flavor.' where productId = 13;
UPDATE Product set productDesc = 'Darjeeling is grown in India and is usually less expensive than white teas grown in Yunnan.' where productId = 14;
UPDATE Product set productDesc = 'Chamomile has gentle notes of apple, and there is a mellow, honey-like sweetness in the cup. It has a silky mouthfeel and yet remains a clean, delicately floral herbal tea, and even from the very first sip it feels wonderfully soothing.' where productId = 15;
UPDATE Product set productDesc = 'Ginger tea is a warming, invigorating, and spicy caffeine-free alternative to black tea or coffee. Ginger is an ancient herb thats been used throughout history for its medicinal benefits, particularly for indigestion, nausea, and motion sickness.' where productId = 16;
UPDATE Product set productDesc = 'Hibiscus tea has a tart flavor similar to that of cranberries and can be enjoyed both hot and cold.' where productId = 17;
UPDATE Product set productDesc = 'Peppermint leaves contain several essential oils that are released when steeped in hot water, including menthol, menthone and limonene. Collectively, these give peppermint tea its refreshing, cooling, minty taste.' where productId = 18;
UPDATE Product set productDesc = 'Rooibos tea is incredibly smooth and gentle with a natural sweetness and slightly nutty taste. When brewed for longer, rooibos is full-bodied and rich, and you can smell the warm woody notes rising from your cup or teapot.' where productId = 19;


