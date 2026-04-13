-- PostgreSQL init script for Meeting Room database
-- This script runs automatically when the PostgreSQL container starts for the first time.

CREATE TABLE IF NOT EXISTS room (
    "roomID" SERIAL PRIMARY KEY,
    "roomName" VARCHAR(100) NOT NULL,
    "roomNumber" VARCHAR(6) NOT NULL UNIQUE,
    location VARCHAR(100),
    capacity INTEGER NOT NULL CHECK (capacity >= 1 AND capacity <= 100)
);

CREATE TABLE IF NOT EXISTS app_user (
    "userID" SERIAL PRIMARY KEY,
    "FirstName" VARCHAR(50) NOT NULL,
    "LastName" VARCHAR(50) NOT NULL,
    "personalID" VARCHAR(13) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(10),
    "RegistrationDate" DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS booking (
    "bookingID" SERIAL PRIMARY KEY,
    "userID" INTEGER NOT NULL REFERENCES app_user("userID") ON DELETE CASCADE,
    "roomID" INTEGER NOT NULL REFERENCES room("roomID") ON DELETE CASCADE,
    "startDateTime" TIMESTAMP NOT NULL,
    "endDateTime" TIMESTAMP NOT NULL,
    CHECK ("endDateTime" > "startDateTime")
);
