const express = require('express');
const router  = express.Router();


// Delete a listing by clearing it fromthe db
module.exports = (db) => {
  router.post("/:delete", (req, res) => {
    const trash = req.params.delete
    db.query(`DELETE FROM listings WHERE id = $1;
    ;` , [trash])
      .then(data => {
        const fav = data.rows;
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
