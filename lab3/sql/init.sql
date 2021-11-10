CREATE LOGIN userx WITH PASSWORD = '1234';
CREATE USER dmytro FOR LOGIN userx;
CREATE DATABASE userdb;
GRANT ALL PRIVILEGES ON DATABASE userdb TO dmytro;
CREATE TABLE users (
    id serial primary key,
    email varchar(255) not null,
    password varchar(255) not null
);