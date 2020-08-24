// const addUser = function(user) {
//   return db.query(`INSERT INTO users (name, email, password)
//   VALUES ($1, $2, $3)
//   RETURNING *;`, [user.username, user.email, user.password])
//   .then(res => res.rows[0]);
// }
// module.exports = addUser;



const generateCookieKey = () => {
  return Math.random()    //  Returns a random number between 0 and 1.
  .toString(36)           //  Base36 encoding; use of letters with digits.
  .substring(2,10);        //  Returns the part of the string between the start and end indexes, or to the end of the string. 
};
module.exports = generateCookieKey; 