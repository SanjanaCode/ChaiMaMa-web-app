const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const redis = require('redis')
const RedisStore = require('connect-redis')(session)


// Imports route handlers
let loadData = require('./routes/loaddata');
let listOrder = require('./routes/account/listorder');
let listProd = require('./routes/products/listprod');
let addCart = require('./routes/checkout/addcart');
let showCart = require('./routes/checkout/showcart');
let checkout = require('./routes/checkout/checkout');
let order = require('./routes/checkout//order');
let login = require('./routes/authentication/login');
let logout = require('./routes/authentication/logout');
let validateLogin = require('./routes/authentication/validateLogin');
// let customer = require('./routes/account/customer');
let product = require('./routes/products/product');
let displayImage = require('./routes/products/displayImage');
let shipment = require('./routes/checkout/ship');
let account = require('./routes/account/account');
let customer = require('./routes/admin/customer');
let adminOrder = require('./routes/admin/orders');
let inventory = require('./routes/admin/inventory');
let adminProduct = require('./routes/admin/products');
let adminShipment = require('./routes/admin/shipment');
let productUpdate = require('./routes/admin/product-update');

// Create an express app
const app = express();
const redisClient = redis.createClient(
  {
    url: process.env.REDIS_URL
  }
);

// This DB Config is accessible globally
dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    enableArithAbort: true,
    encrypt: true,
    abortTransactionOnError: true
  }
}

// Setting up JSON Parser
app.use(express.json()); // Parsing json string to js object
app.use(express.urlencoded({ extended: true })); // Parsing queries in POST http message (Content-Type: application/x-www-form-urlencoded)

// Setting up the session.
// Redis is used as the session store.
app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 1 * 60 * 60 * 1000, // Expire after 1 hour
  }
}))

// Setting up the rendering engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'public'));


// Setting up Express.js routes.
// These present a "route" on the URL of the site.
// Eg: http://127.0.0.1/loaddata
if (process.env.NODE_ENV === 'dev') { app.use('/loaddata', loadData); }
app.use('/listorder', listOrder);
app.use('/listprod', listProd);
app.use('/addcart', addCart);
app.use('/showcart', showCart);
app.use('/checkout', checkout);
app.use('/order', order);
app.use('/login', login);
app.use('/logout', logout);
app.use('/validateLogin', validateLogin);
app.use('/images', express.static('public/images'));
app.use('/stylesheets', express.static('public/stylesheets'));
app.use('/js', express.static('public/javascripts'));
app.use('/fonts', express.static('public/fonts'));
app.use('/product', product);
app.use('/displayImage', displayImage);
app.use('/shipment', shipment);
app.use('/account', account);
app.use('/admin/customer', customer);
app.use('/admin/orders', adminOrder);
app.use('/admin/inventory', inventory);
app.use('/admin/products', adminProduct);
app.use('/admin/shipment', adminShipment);
app.use('/admin/shipment', adminShipment);
app.use('/admin/product-update', productUpdate);

// Rendering the main page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "public", "layouts", "index.html"));
})

// Starting our Express app
let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server started on port ' + port));