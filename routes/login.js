const express = require('express');
const router  = express.Router();

//login -- checks for matching password and validcombination
//if errors, renders cute error page
module.exports = (db) => {
  router.post("/", (req, res) => {
    const user = req.body;
    if (!user.email || !user.password) {
      let templateVars = {};
      templateVars.username = null;
      return res.render("fill_all_fields", templateVars);
    }
      db.query(`SELECT * FROM users WHERE email = $1;`, [user.email])
      .then(data => {
        if (!data.rows[0]) {
          let templateVars = {};
          templateVars.username = null;
          return res.render("wrong_username", templateVars)
        } else {
          console.log(data.rows[0]);
          if( data.rows[0].password === user.password) {
            let userCookie = data.rows[0];
            req.session.user_id = userCookie.id;
            req.session.username = userCookie.username;
            res.redirect("/");
          } else {
            let templateVars = {};
            templateVars.username = null;
            return res.render("wrong_username", templateVars)
          }
        }
    });
  })
  return router;
}

