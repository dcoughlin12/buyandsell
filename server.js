// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();
// Cookies
const { generateCookieKey, getAllListings } = require('./helpers')
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: [generateCookieKey(), generateCookieKey(), generateCookieKey(), 'user_id','username']
}));


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));


// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const registerUser = require("./routes/register_user");
// const individualListing = require("./routes/listings.js");
const loginUser = require("./routes/login.js")
const createListing = require("./routes/create.js");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/register", registerUser(db));
app.use("/create", createListing(db))

// app.use("/api/listingstest", individualListing(db));
app.use("/login", loginUser(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  let templateVars = {};
  db.query(`SELECT * FROM listings WHERE for_sale = 't';`)
  .then(data => {
    if(!req.session.user_id) {
    templateVars.username = null;
    templateVars.listings = data.rows;
    res.render("index", templateVars)

  } else {
    templateVars.username = req.session.username;
    templateVars.listings = data.rows;
    res.render("index", templateVars);
  }
});
});

app.get("/register", (req, res) => {
  if(!req.session.user_id) {
    let templateVars = { username: null };
    res.render("register", templateVars)
  } else {
    let templateVars =  { username : req.session.username };
  res.render("register", templateVars);
  }
});

app.get("/login", (req, res) => {
  if(!req.session.user_id) {
    let templateVars = { username: null };
    res.render("login", templateVars)
  } else {
    let templateVars =  { username : req.session.username };
    res.render("login", templateVars);
  }
});

app.get("/logout", (req, res) => {
  req.session.user_id = null;
  req.session.username = null;
  res.redirect('/');
});

app.get("/favorites", (req, res) => {
  let templateVars = {};
  if(!req.session.user_id) {
    // templateVars.username = null;
    res.redirect("/")
  } else {
    templateVars.username = req.session.username;
    db.query(`SELECT * FROM listings JOIN favorites ON listing_id = listings.id WHERE
     favorites.user_id = $1 AND is_fave = true;`, [req.session.user_id])
    .then(data => {
      // console.log(data.rows)
      templateVars.myListings = data.rows;
      res.render("favorites", templateVars);
    })
  }
});

app.get("/myListings", (req, res) => {
  let templateVars = {};
  if(!req.session.user_id) {
    // templateVars.username = null;
    res.redirect("/")
  } else {
    templateVars.username = req.session.username;
    db.query(`SELECT * FROM listings WHERE user_id = $1;`, [req.session.user_id])
    .then(data => {
      console.log('!!!!!!! myListings data.rows !!!!', data.rows[0].id)
      templateVars.myListings = data.rows;
      res.render("myListings", templateVars);
    })
  }
});


app.get("/each_listing/:listing_id", (req, res) => {
  if(!req.session.user_id) {
    let templateVars = { username: null };
    res.render("each_listing", templateVars)
  } else {
    const listing_id = req.params.listing_id;
    console.log(listing_id);
    db.query(`SELECT * FROM listings WHERE id = $1;`,
    [listing_id])
    .then( (data) =>{
      let listings_info = data.rows[0];
      console.log(listings_info);
      let templateVars =  { username : req.session.username };
      // res.send(listings_info, templateVars);
      res.json({ listings_info });

    } )
  }
});


app.get("/create", (req, res) => {
  if(!req.session.user_id) {
    let templateVars = { username: null };
    res.render("create", templateVars)
  } else {
    let templateVars =  { username : req.session.username };
  res.render("create", templateVars);
  }
});

app.get("/messages", (req, res) => {
  if(!req.session.user_id) {
    let templateVars = { username: null };
    res.render("messages", templateVars)
  } else {
    let templateVars =  { username : req.session.username };
  res.render("messages", templateVars);
  }
});

// make express look in the public directory for assets (css/js/img)
// app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
