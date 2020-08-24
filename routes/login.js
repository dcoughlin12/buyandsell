const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.post("/", (req, res) => {
    const user = req.body;

    if (!user.email || !user.password) {
      return res.send("Please fill in all fields");
    }
        db.query(`SELECT EXISTS(SELECT username FROM users WHERE email = $1 AND password = $2);`,
        [user.email, user.password])
        .then(data => {
          const testing = data.rows['0'].exists;
          if (!testing) {
            return res.send("Email or password incorrect")
          } else {
              let userCookie = data.rows['0'];
              console.log('!!!!!! COOKIE', userCookie.id);
              req.session.user_id = userCookie.id;
              res.redirect("/");
              }
            })
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });
            })
          }
    );
    return router;
  }
