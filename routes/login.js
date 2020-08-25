const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.post("/", (req, res) => {
    const user = req.body;

    if (!user.email || !user.password) {
      return res.send("Please fill in all fields");
    }
        db.query(`SELECT * FROM users WHERE email = $1 AND password = $2;`, [user.email, user.password])
        .then(data => {
          if (!data.rows[0]) {
            return res.send("Email or password incorrect")
          } else {
            db.query(`SELECT * FROM users WHERE email = $1 AND password = $2;`,
            [user.email, user.password])
            .then((data) => {
              let userCookie = data.rows[0];
              console.log(`Logged as ${userCookie.username}!!!!!!`);
              req.session.user_id = userCookie.id;
              req.session.object = userCookie;
              console.log(req.session.object.username);
              console.log(req.session.user_id);
              res.redirect("/")
            })
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });
            })}
        })
  });
    return router;
}
