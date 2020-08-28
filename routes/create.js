const express = require('express');
const router  = express.Router();



//creates new listing by inserting it into the db
module.exports = (db) => {
  router.post("/", (req, res) => {
    const listing = req.body;
    if (!req.session.user_id) {
      res.redirect("/login")
    } else {
    db.query(`INSERT INTO listings (title, description, image_url, price, user_id)
    VALUES ($1, $2, $3, $4,$5) RETURNING *;` ,
    [listing.title, listing.description, listing.image, listing.cost, req.session.user_id])
      .then(data => {
        const listings = data.rows;
        res.redirect("/myListings");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
        });
      }
    });
  return router;
}
