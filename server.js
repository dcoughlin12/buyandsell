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
const registerUser = require("./routes/register_user");
const eachListing = require("./routes/each_listing");
const loginUser = require("./routes/login.js")
const createListing = require("./routes/create.js");
const markAsSold = require("./routes/sold.js");
const messageResponses = require("./routes/messages.js");
const unfavorite = require("./routes/unfavorite");
const favoriteItem = require("./routes/favorite");
const deleteListing = require("./routes/deleteListing");
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/register", registerUser(db));
app.use("/create", createListing(db));
app.use("/messages/", eachListing(db));
app.use("/fave/", favoriteItem(db));
app.use("/unfave/", unfavorite(db));
app.use("/sold/", markAsSold(db));
app.use("/messagesResponses", messageResponses(db))
app.use("/delete/", deleteListing(db));
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

// Get route to filter from low to high, renders home page with filtered data
app.get("/lowtohigh", (req, res) => {
  let templateVars = {};
  db.query(`SELECT * FROM listings WHERE for_sale = 't' ORDER by price;`)
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
})

// Get route to filter from high to low, renders home page with filtered data
app.get("/hightolow", (req, res) => {
  let templateVars = {};
  db.query(`SELECT * FROM listings WHERE for_sale = 't' ORDER by price DESC;`)
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
})

// Renders Register page
app.get("/register", (req, res) => {
  if(!req.session.user_id) {
    let templateVars = { username: null };
    res.render("register", templateVars)
  } else {
    let templateVars =  { username : req.session.username };
  res.render("register", templateVars);
  }
});

// Renders Login page
app.get("/login", (req, res) => {
  if(!req.session.user_id) {
    let templateVars = { username: null };
    res.render("login", templateVars)
  } else {
    let templateVars =  { username : req.session.username };
    res.render("login", templateVars);
  }
});

// Clears cookies to lok out the user and redirects to home
app.get("/logout", (req, res) => {
  req.session.user_id = null;
  req.session.username = null;
  req.session.listing = null;
  res.redirect('/');
});

// Renders favorites with appropriate listings for the user logged in
app.get("/favorites", (req, res) => {
  let templateVars = {};
  if(!req.session.user_id) {
    res.redirect("/")
  } else {
    templateVars.username = req.session.username;
    db.query(`SELECT * FROM listings JOIN favorites ON listing_id = listings.id WHERE
     favorites.user_id = $1 AND is_fave = true;`, [req.session.user_id])
    .then(data => {
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
      console.log(data.rows);
      templateVars.myListings = data.rows;
      res.render("myListings", templateVars);
    })
  }
});

// Individual Listings route
app.get("/each_listing/:listing_id", (req, res) => {
  if(!req.session.user_id) {
    res.redirect("/login");
  } else {
    const listing_id = req.params.listing_id;
    db.query(`SELECT * FROM listings WHERE id = $1;`,
    [listing_id])
    .then( (data) =>{
      let listing = data.rows[0];
      req.session.listing_id = listing.id;
      let templateVars =  { username : req.session.username, listing_id : listing };
      res.render("each_listing", templateVars)
    } )
  }
});

// Create listing route
app.get("/create", (req, res) => {
  if(!req.session.user_id) {
    let templateVars = { username: null };
    res.render("create", templateVars)
  } else {
    let templateVars =  { username : req.session.username };
    res.render("create", templateVars);
  }
});

// Renders messages page with all message user has sent and recieved
app.get("/messages", (req, res) => {
  if(!req.session.user_id) {
    res.redirect("/login");
  } else {
    db.query(`SELECT messages.*, messages.id AS message_id, listings.*, users.username AS buyer_name
    FROM messages
    INNER JOIN users ON users.id = messages.buyer_id
    INNER JOIN listings ON messages.listing_id = listings.id
    WHERE messages.user_id = $1 OR messages.buyer_id = $2
    ORDER BY messages.id DESC;`,
    [req.session.user_id, req.session.user_id])
    .then((data) => {
      const listOfMessages = data.rows;
      let templateVars =  { username : req.session.username, listOfMessages };
      res.render("messages", templateVars);
    })
  }
});

// make express look in the public directory for assets (css/js/img)
// app.use(express.static(__dirname + '/public'));
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

