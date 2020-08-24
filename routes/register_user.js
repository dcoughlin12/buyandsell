const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.post("/", (req, res) => {
    const user = req.body;
    // if (db.query(`SELECT username
    // FROM users WHERE username = $1`, [user.username])){
    //   console.log('USERNAME TAKEN IN DATABASE')

    // WHERE NOT EXISTS
    // (SELECT * FROM theTable
    // WHERE image_id = 39 AND tag_id = 8)

    // } else {
    //   console.log('NOT IN BATABASE')
    // }
    // if (db.query(`SELECT email
    // FROM users WHERE email = $1`, [user.email])) {

    // }
    // if (db.query(`SELECT phone_number
    // FROM users WHERE phone_number = $1`, [user.phone_number])) {

    // }

    if (!user.username || !user.email || !user.password || !user.phone_number) {
      return res.send("Please fill in all fields");
    }

        db.query(`SELECT EXISTS(SELECT username FROM users WHERE username = $1 OR email = $2);`,
        [user.username, user.email])
        .then(data => {
          const testing = data.rows['0'].exists;
          if (testing) {
            return res.send("User already exists")
          }
          console.log(testing)
        })

        .then(
          db.query(`INSERT INTO users (username, email, password, phone_number) VALUES ($1, $2, $3, $4);`
          , [user.username, user.email, user.password, user.phone_number])
          .then(() => {
            res.redirect("/");
            })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          })


        )

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
