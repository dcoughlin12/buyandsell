// const express = require('express');
// const router  = express.Router();

// module.exports = {
//   router.get("/", (req, res) => {
//     db.query(`SELECT * FROM listings WHERE for_sale = 't';`)
//       .then(data => {
//         const listings = data.rows;
//         // console.log(listings);
//         const templateVars = {
//           username: req.session.username,
//           listings: listings
//         };
//         res.render('listings', templateVars);
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//         });
//   });
//   return router;
// };
