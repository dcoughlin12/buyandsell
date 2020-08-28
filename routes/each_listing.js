const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.post("/", (req, res) => {
    const message =  req.body.text;
    const listing = req.session.listing_id;
    const buyer_id = req.session.user_id;
    db.query (`SELECT user_id FROM listings WHERE id = $1;`, [listing])
      .then(data => {
        const seller_id = data.rows[0].user_id;
        db.query(`INSERT INTO messages (message, user_id, listing_id, buyer_id, sender_name)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [message, seller_id, listing, buyer_id, req.session.username])
      })
        .then(() => {
          res.redirect("/messages")
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
      }
   );
  return router;
}
