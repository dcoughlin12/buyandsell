// Generate a random cookie key
const generateCookieKey = () => {
  return Math.random()    //  Returns a random number between 0 and 1.
  .toString(36)           //  Base36 encoding; use of letters with digits.
  .substring(2,10);        //  Returns the part of the string between the start and end indexes, or to the end of the string.
};


const getAllListings = (db) => {
  db.query(`SELECT * FROM listings WHERE for_sale = 't';`)
  .then(data => {
    const listings = data.rows[0];
    return listings;
  })
};


module.exports = {
  generateCookieKey,
  getAllListings
};
