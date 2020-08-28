const express = require('express');
const router  = express.Router();

//sets is_fav for that user and that listing id as true
module.exports = (db) => {
  router.post("/:fav", (req, res) => {
    const favorite = req.params.fav
    db.query(`UPDATE favorites SET is_fave = false WHERE id = $1 RETURNING *;
    ;` , [favorite])
      .then(data => {
        const fav = data.rows;
        res.redirect("/favorites");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
        });

    });
  return router;
}
