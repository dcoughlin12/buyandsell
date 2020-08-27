const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/:fav", (req, res) => {
    let listingId = req.params.fav
      db.query(`INSERT INTO favorites (user_id, listing_id)
      VALUES($1, $2) RETURNING *;`, [req.session.user_id, listingId])
      .then((data) =>  {
        res.redirect("/favorites")
      })
    });
    return router;
  }
