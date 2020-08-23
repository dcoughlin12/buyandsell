const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.post("/", (req, res) => {
    const user = req.body;
    db.query(`INSERT INTO users (username, email, password, phone_number) VALUES ($1, $2, $3, $4);`
    , [user.username, user.email, user.password, user.phone_number])
      .then(() => {
        res.redirect("/")
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

    return router;
};


// app.post("/register", (req, res) => {
//   const user  = req.body
//   return db.query(`INSERT INTO users (username, email, password, phone_number) VALUES ($1, $2, $3, $4);`,
//   [user.username, user.email, user.password, user.phone_number], (error, results) => {
//     if (error) {
//       throw error
//     }
//     res.redirect("/")
//   })
// });
