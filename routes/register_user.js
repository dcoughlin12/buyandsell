const express = require('express');
const router  = express.Router();




module.exports = (db) => {
  router.post("/", (req, res) => {
    const user = req.body;
    // let user_id = user.id;
    // req.session.user_id = user_id;
    db.query(`INSERT INTO users (username, email, password, phone_number) VALUES ($1, $2, $3, $4);`
    , [user.username, user.email, user.password, user.phone_number])
      .then(() => {
        let user_id = user.username;
        req.session.user_id = user_id;
        req.session.user_id
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






// module.exports = (db) => {
//   router.post("/", (req, res) => {
//     let user = req.body;
//     if (!user.username || !user.email || !user.password || !user.phone_number){
//       return res.send("ERROR EMPTY FIELD")
//     } else if (db.query(`SELECT EXISTS(SELECT username FROM users WHERE username = $1 OR email = $2);`,
//     [user.username, user.email])
//       .then(data => {
//         const testing = data.rows['0'].exists;
//         return testing
//       // .catch(err => {
//       //   res
//       //     .status(500)
//       //     .json({ error: err.message });
//       //  });

//       })){

//       return res.send("Username taken")

//     } else {

//       db.query(`INSERT INTO users (username, email, password, phone_number) VALUES ( $1, $2, $3, $4);`
//       , [user.username, user.email, user.password, user.phone_number])
//         .then(() => {
//           res.redirect("/")
//         })
//         .catch(err => {
//           res
//             .status(500)
//             .json({ error: err.message });
//         });

//     }

//     });

//     return router;
// };




