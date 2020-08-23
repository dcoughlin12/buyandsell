/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
        });
  });
  return router;
};

// module.exports = (db) => {
//   router.post("/register", (req, res) => {
//     const user = req.body

//     db.query(`INSERT INTO users (name, email, password)
//   VALUES ($1, $2, $3)
//   RETURNING *;`, [user.username, user.email, user.password])
//       .then(user => {
//         res.json({ user });
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   });


//   return router;
// };
