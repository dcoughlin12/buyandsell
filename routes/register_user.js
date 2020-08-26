const express = require('express');
const router  = express.Router();




module.exports = (db) => {
  router.post("/", (req, res) => {
    const user = req.body;

    if (!user.username || !user.email || !user.password || !user.phone_number) {
      return res.send("Please fill in all fields");
    }
        db.query(`SELECT EXISTS(SELECT username FROM users WHERE username = $1 OR email = $2);`,
        [user.username, user.email])
        .then(data => {
          const testing = data.rows['0'].exists;
          if (testing) {
            return res.send("User already exists")
          } else {
            db.query(`INSERT INTO users (username, email, password, phone_number) VALUES ($1, $2, $3, $4) RETURNING *;`
            , [user.username, user.email, user.password, user.phone_number])
            .then((data) => {
              let userCookie = data.rows[0];
              console.log(userCookie);
              req.session.user_id = userCookie.id;
              req.session.username = userCookie.username;
              console.log(req.session.user_id);
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


// RETURNS A BOOLEAN
  // module.exports = (db) => {
  //   router.get("/", (req, res) => {
  //     db.query(`SELECT EXISTS(SELECT username FROM users WHERE username = 'Robert');`)
  //       .then(data => {
  //         const users = data.rows;
  //         console.log(users['0'].exists);
  //         res.json({ users });
  //       })
  //       .catch(err => {
  //         res
  //           .status(500)
  //           .json({ error: err.message });
  //         });
  //   });
  //   return router;
  // };

//  db.query(`SELECT username, email FROM users WHERE username = $1 OR email = $2;`, [user.username, user.email])
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//     });
//     return router;
// };






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




