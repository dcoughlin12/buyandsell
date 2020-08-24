const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM listings;`)
      .then(data => {
        const listings = data.rows;
        const templateVars = {
          listings: listings,
        };
        res.render('listings', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
        });
  });
  return router;
};
