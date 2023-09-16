
SET client_encoding = 'UTF8';

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid(),
    roles character varying(100) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL CHECK (length(email)>5),
    password character varying(255) NOT NULL CHECK (length(password)>5),
    birth_date date NOT NULL,
    createdate date DEFAULT CURRENT_DATE NOT NULL,
    PRIMARY KEY (email)
);

-- ADD CONSTRATINTS AFTER TABLE CREATED
-- ALTER TABLE users
--     add constraint min_len_password check (length(password) > 5);
--     add constraint min_len_email check (length(password) > 5);

-- ******************
-- IMPORT DATA
-- ******************

-- INSERT DEMO USER: demo.user@gmail.com, password

INSERT INTO users (roles, first_name, last_name, email, birth_date, password)
    VALUES('user,admin','Demo','User','demo.user@gmail.com','1970-11-25T00:00:00.000Z','$2b$12$819ocayl9ya63PFpOd/ZR.H8YHO8bIH6qzK5ohoXEiVn75ozL2AD.');

-- ************************************
-- TODO ITEMS TABLE FOR DEMO

CREATE TABLE todo_list (
    id serial primary key,
    title varchar(150) NOT NULL
);

CREATE TABLE todo_item (
    id serial primary key,
    title varchar(150) not null,
    checked boolean not null default false,
    list_id integer not null,
    foreign key(list_id) references todo_list(id)
);