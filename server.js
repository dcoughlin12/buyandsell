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
const showListings = require("./routes/listings.js");
const loginUser = require("./routes/login.js")

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/register", registerUser(db));


// app.use("/listings", showListings(db));
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

    // console.log(req.session.object);
    templateVars.listings = data.rows;
    // console.log('!!!!!!!!', templateVars);
    res.render("index", templateVars)

  } else {
    templateVars.username = req.session.username;
    templateVars.listings = data.rows;
    // console.log('logged in templateVars...', templateVars)
    res.render("index", templateVars);
  }
});
});

app.get("/register", (req, res) => {
  if(!req.session.object) {
    let templateVars = { username: null };
    res.render("register", templateVars)
  } else {
    let templateVars =  { username : req.session.object.username };
  res.render("register", templateVars);
  }
});

app.get("/login", (req, res) => {
  if(!req.session.object) {
    let templateVars = { username: null };
    res.render("login", templateVars)
  } else {
    let templateVars =  { username : req.session.object.username };
    res.render("login", templateVars);
  }
});

app.get("/logout", (req, res) => {
  req.session.user_id = null;
  req.session.username = null;
  res.redirect('/');
});

app.get("/favorites", (req, res) => {
  if(!req.session.object) {
    let templateVars = { username: null };
    res.render("favorites", templateVars)
  } else {
    let templateVars =  { username : req.session.object.username };
  res.render("favorites", templateVars);
  }
});

app.get("/create", (req, res) => {
  if(!req.session.object) {
    let templateVars = { username: null };
    res.render("create", templateVars)
  } else {
    let templateVars =  { username : req.session.object.username };
  res.render("create", templateVars);
  }
});

//I ADDED THIS AND THEN NOTICED THE LISTINGS.EJS FILE SO I WILL LEAVE THIS COMMENTED OUT UNTIL I TALK TO ONE OF YOU ABOUT IT. - Devin
// app.get("/myListings", (req, res) => {
//   if(!req.session.object) {
//     let templateVars = { username: null };
//     res.render("myListings", templateVars)
//   } else {
//     let templateVars =  { username : req.session.object.username };
//   res.render("myListings", templateVars);
//   }
// });


app.get("/messages", (req, res) => {
  if(!req.session.object) {
    let templateVars = { username: null };
    res.render("messages", templateVars)
  } else {
    let templateVars =  { username : req.session.object.username };
  res.render("messages", templateVars);
  }
});

// make express look in the public directory for assets (css/js/img)
// app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
