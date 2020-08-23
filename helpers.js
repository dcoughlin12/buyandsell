const addUser = function(user) {
  return db.query(`INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`, [user.username, user.email, user.password])
  .then(res => res.rows[0]);
}
module.exports = addUser;
