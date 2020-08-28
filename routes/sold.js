const express = require('express');
const router  = express.Router();

//marking an item as sold
//changes for_sale boolean to false
module.exports = (db) => {
  router.post("/:lstId", (req, res) => {
    const listingId = req.params.lstId
    db.query(`UPDATE listings SET for_sale = false WHERE id = $1 RETURNING *;
    ;` , [listingId])
      .then(data => {
        const sold = data.rows;
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
