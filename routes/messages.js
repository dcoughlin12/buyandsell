const express = require('express');
const router  = express.Router();

//rendering messages page with each message that the user has sent or recieved
//order by newest first
module.exports = (db) => {
  router.post("/:msgId", (req, res) => {
    const messageId = req.params.msgId;
    const message = req.body.text;
    if (!req.session.user_id) {
      res.redirect("/login")
    } else {
      db.query(`SELECT * FROM messages WHERE id = $1;`, [messageId])
      .then(data => {
        const msgDetails = data.rows[0];
        const to = msgDetails.buyer_id
        const from = msgDetails.user_id
        db.query(`INSERT INTO messages (message, user_id, listing_id, buyer_id, sender_name)
          VALUES ($1, $2, $3, $4, $5) RETURNING *;` ,
          [message, msgDetails.user_id, msgDetails.listing_id, msgDetails.buyer_id, req.session.username])
          .then(data => {
            const response = data.rows;
            res.redirect("/messages");
          })
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
