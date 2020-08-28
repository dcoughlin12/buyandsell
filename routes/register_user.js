const express = require('express');
const router  = express.Router();



//registers user by adding them to db. if errors renders a cute error page
//validates that username, email dont exist in db
module.exports = (db) => {
  router.post("/", (req, res) => {
    const user = req.body;

    if (!user.username || !user.email || !user.password || !user.phone_number) {
      let templateVars = {};
      templateVars.username = null;
      return res.render("fill_all_fields", templateVars);
    }
        db.query(`SELECT EXISTS(SELECT username FROM users WHERE username = $1 OR email = $2);`,
        [user.username, user.email])
        .then(data => {
          const testing = data.rows['0'].exists;
          if (testing) {
            let templateVars = {};
            templateVars.username = null;
            return res.render("username_exists", templateVars)
          } else {
            db.query(`INSERT INTO users (username, email, password, phone_number) VALUES ($1, $2, $3, $4) RETURNING *;`
            , [user.username, user.email, user.password, user.phone_number])
            .then((data) => {
              let userCookie = data.rows[0];
              req.session.user_id = userCookie.id;
              req.session.username = userCookie.username;
              res.redirect("/");
              })
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });
            })
          }
        })
    });
  return router;
}









