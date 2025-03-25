CREATE DATABASE IF NOT EXISTS BookInventory;

USE BookInventory;

CREATE TABLE Books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookTitle VARCHAR(255) NOT NULL,
    authorName VARCHAR(255),
    imageURL TEXT,
    category VARCHAR(255),
    bookDescription TEXT,
    bookPDFURL TEXT
);

CREATE TABLE BooksFavorite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookTitle VARCHAR(255) NOT NULL,
    authorName VARCHAR(255),
    imageURL TEXT,
    category VARCHAR(255),
    bookDescription TEXT,
    bookPDFURL TEXT
);
