const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/:lstId", (req, res) => {
    const listingId = req.params.lstId
    db.query(`UPDATE listings SET for_sale = false WHERE id = $1 RETURNING *;
    ;` , [listingId])
      .then(data => {
        const sold = data.rows;
        console.log('this is data.rows!!!!!!!!!!!!!', sold)
        res.redirect("/myListings");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
        });

    });
    return router;
  }
