const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.post("/", (req, res) => {
    const user = req.body;

    if (!user.email || !user.password) {
      return res.send("Please fill in all fields");
    }
        db.query(`SELECT * FROM users WHERE email = $1;`, [user.email])
        .then(data => {
          if (!data.rows[0]) {
            return res.send("Email incorrect")
          } else {
            console.log(data.rows[0]);
            if( data.rows[0].password === user.password) {
              let userCookie = data.rows[0];
              req.session.user_id = userCookie.id;
              req.session.username = userCookie.username;
              res.redirect("/");
            } else {
              res.send("password incorrect")
            }
        }
     });
  })
return router;
}

