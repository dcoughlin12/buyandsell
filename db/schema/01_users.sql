-- Drop and recreate Users table (Example)
DROP TABLE IF EXISTS users, listings, favorites, messages  CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  phone_number VARCHAR(255)
);


CREATE TABLE listings (
  id SERIAL PRIMARY KEY NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  post_date DATE NOT NULL,
  for_sale BOOLEAN NOT NULL DEFAULT TRUE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY NOT NULL,
  is_fave BOOLEAN NOT NULL DEFAULT TRUE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  message TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
