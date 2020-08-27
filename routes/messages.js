const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.post("/", (req, res) => {
    const message = req.body;
    console.log('message =============', message.text);
    if (!req.session.user_id) {
      res.redirect("/login")
    } else {
    console.log('!!!!!!!!!! message sent !!!!!!', message);
    db.query(`INSERT INTO messages (message, user_id, listing_id, buyer_id)
    VALUES ($1, $2, $3, $4) RETURNING *;` ,
    [message.text, , req.session.user_id])
      .then(data => {
        const listings = data.rows;
        console.log('this is data.rows!!!!!!!!!!!!!', listings)
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