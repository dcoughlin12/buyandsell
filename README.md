GoodBuy
=========

GoodBuy is a full stack web application built with Node and Express that act as a middleman between buyers and sellers of any kind of product. It was developed our midterm project in Lighthouse Lab Web Dev Bootcamp.

https://goodbuy-app.herokuapp.com/

!["screenshot description"](https://github.com/dcoughlin12/buyandsell/blob/master/doc/goodbuy1.png)
!["screenshot description"](https://github.com/dcoughlin12/buyandsell/blob/master/doc/goodbuy2.png)

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- Cookie-Session
