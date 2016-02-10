-- This file is formatted based on SQLite3's syntax
-- Some small fixes might be needed to use in other database.
 create table projects (
    id serial PRIMARY KEY,
    url varchar(255) NULL,
    title varchar(255) NOT NULL,
    description text NOT NULL,
    image_url test NULL,
    created_at date NOT NULL DEFAULT CURRENT_DATE
  );