-- PostgreSQL init script for Meeting Room database
-- This script runs automatically when the PostgreSQL container starts for the first time.
-- Column names are unquoted so PostgreSQL stores them as lowercase,
-- matching what Hibernate sends (PhysicalNamingStrategyStandardImpl + PostgreSQL case-folding).

CREATE TABLE IF NOT EXISTS room (
    roomid SERIAL PRIMARY KEY,
    roomname VARCHAR(100) NOT NULL,
    roomnumber VARCHAR(6) NOT NULL UNIQUE,
    location VARCHAR(100),
    capacity INTEGER NOT NULL CHECK (capacity >= 1 AND capacity <= 100)
);

CREATE TABLE IF NOT EXISTS app_user (
    userid SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    personalid VARCHAR(13) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(10),
    registrationdate DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS booking (
    bookingid SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL REFERENCES app_user(userid) ON DELETE CASCADE,
    roomid INTEGER NOT NULL REFERENCES room(roomid) ON DELETE CASCADE,
    startdatetime TIMESTAMP NOT NULL,
    enddatetime TIMESTAMP NOT NULL,
    CHECK (enddatetime > startdatetime)
);
