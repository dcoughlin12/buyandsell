// Generate a random cookie key
const generateCookieKey = () => {
  return Math.random()    //  Returns a random number between 0 and 1.
  .toString(36)           //  Base36 encoding; use of letters with digits.
  .substring(2,10);        //  Returns the part of the string between the start and end indexes, or to the end of the string.
};

module.exports = { generateCookieKey };
