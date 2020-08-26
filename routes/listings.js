const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const listing = {
    title: "Added new listing",
    description: "it seems it worked",
    price: 5000,
    image_url: "https://avatars2.githubusercontent.com/u/10762771?s=400&v=4",
    user_id: 4
  };
   router.post("/", (req, res) => {
    db.query(`INSERT INTO listings (title, description, image_url, price, post_date, user_id)
    VALUES ($1, $2, $3, $4, NOW(),$5) RETURNING *;` ,
    [listing.title, listing.description, listing.image_url, listing.price, listing.user_id])
      .then(data => {
        const listings = data.rows;
        res.json ({ listings });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
        });
  });
  return router;
};
