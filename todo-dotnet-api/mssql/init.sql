
-- ************************************
-- COMMANDER ITEMS TABLE FOR DEMO

CREATE DATABASE todo_db;
GO

USE todo_db;
GO

CREATE TABLE TodoLists (
  id int IDENTITY(1,1) primary key,
  title varchar(150) NOT NULL
);

GO

CREATE TABLE TodoItems (
  id int IDENTITY(1,1) primary key,
  title varchar(150) not null,
  done tinyint not null default 0,
  list_id int not null,
  foreign key(list_id) references TodoLists(id)
);

GO