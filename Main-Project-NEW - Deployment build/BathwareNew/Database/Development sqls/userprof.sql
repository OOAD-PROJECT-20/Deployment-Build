CREATE DATABASE user_profile_db;
USE user_profile_db;


CREATE TABLE user (
                      userId INT AUTO_INCREMENT PRIMARY KEY,
                      userName VARCHAR(100) NOT NULL UNIQUE,
                      userPassword VARCHAR(100) NOT NULL,
                      telephone VARCHAR(15),
                      authority VARCHAR(15) NOT NULL,
                      email VARCHAR(255)
);

CREATE TABLE ADMIN (
                       adminId INT AUTO_INCREMENT PRIMARY KEY,
                       userId INT NOT NULL,
                       FOREIGN KEY (userId) REFERENCES USER(userId) ON DELETE CASCADE
);

SHOW TABLES;

SELECT * FROM USER;

INSERT INTO USER (userName, userPassword, telephone, authority) VALUES
                                                                    ('admin', 'adminpass', '1234567890', 'ADMIN'),
                                                                    ('user', 'userpass', '0987654321', 'USER');

INSERT INTO ADMIN (userId) VALUES (1);

ALTER TABLE USER MODIFY COLUMN email VARCHAR(100);


UPDATE user
SET email = 'admin@example.com'
WHERE userId = 1;


UPDATE user
SET email = 'user@example.com'
WHERE userId = 2;

DROP USER IF EXISTS 'springuser'@'localhost';
CREATE USER 'springuser'@'localhost' IDENTIFIED BY 'springpass';
GRANT ALL PRIVILEGES ON user_profile_db.* TO 'springuser'@'localhost';


CREATE TABLE customer (
                          customerId INT AUTO_INCREMENT PRIMARY KEY,
                          userId INT UNIQUE,
                          FOREIGN KEY (userId) REFERENCES user(userId)
);

CREATE TABLE admin (
                       adminId INT AUTO_INCREMENT PRIMARY KEY,
                       userId INT UNIQUE,
                       adminLevel INT,
                       FOREIGN KEY (userId) REFERENCES user(userId)
);

SELECT * FROM customer;
SELECT * FROM admin ;
SELECT * FROM user;

INSERT INTO customer (userId)
VALUES (2);

INSERT INTO admin (userId, adminLevel)
VALUES (1, 1);



INSERT INTO user (userName, userPassword, telephone, authority, email)
VALUES
    ('Nuwan_d', 'pass123', '0712345678', 'customer', 'nuwandperera@gmail.com'),
    ('Sachini3', 'pass234', '0723456789', 'customer', 'sachinifernando@gmail.com'),
    ('Kasunjay', 'pass345', '0734567890', 'customer', 'kasunjay123@yahoo.com'),
    ('Tharushi4', 'pass456', '0745678901', 'customer', 'tharushi.d@gmail.com'),
    ('RDilshan', 'pass567', '0756789012', 'customer', 'dilshr@hotmail.com'),
    ('MalithS', 'admin001', '0767890123', 'admin', 'smalith1@abc.lk'),
    ('GayaniRaj', 'admin002', '0778901234', 'admin', 'gayaniraj2001@gmail.com'),
    ('niranjanp', 'admin003', '0789012345', 'admin', 'niranjan98p@gmail.com'),
    ('vishwa2', 'pass678', '0790123456', 'customer', 'vishwa2k@hotmail.com'),
    ('Renuka789', 'pass789', '0701234567', 'customer', 'renuka789t@gmail.com');



INSERT INTO customer (userId) VALUES
                                  (1),
                                  (2),
                                  (3),
                                  (4),
                                  (5),
                                  (9),
                                  (10);

INSERT INTO admin (userId, adminLevel) VALUES
                                           (6, 1),
                                           (7, 2),
                                           (8, 2);



SELECT user.userId, user.userName, user.email, user.telephone
FROM user
         JOIN customer ON user.userId = customer.userId;


SELECT user.userName, user.email, admin.adminLevel
FROM user
         JOIN admin ON user.userId = admin.userId
WHERE admin.adminLevel >= 2;


SELECT userId, userName, email
FROM user
WHERE userName LIKE 'n%';


SELECT user.userName, user.email
FROM user
         JOIN customer ON user.userId = customer.userId
ORDER BY user.userName ASC;


SELECT COUNT(*) AS totalAdmins
FROM admin;


SELECT user.userId, user.userName
FROM user
         LEFT JOIN admin ON user.userId = admin.userId
WHERE admin.userId IS NULL;


SELECT userName, telephone
FROM user
WHERE telephone LIKE '077%';


SELECT user.userName, user.email
FROM user
         JOIN customer ON user.userId = customer.userId
WHERE user.email LIKE '%@gmail.com';


SELECT userId, userName, email
FROM user
WHERE userName RLIKE '^[NS]';


SELECT userName, email
FROM user
WHERE email RLIKE '\\.(com|lk)$';


SELECT userName, telephone
FROM user
         JOIN customer ON user.userId = customer.userId
WHERE telephone RLIKE '^07[1-3]';


SELECT userName, adminLevel
FROM user
         JOIN admin ON user.userId = admin.userId
WHERE userName RLIKE '[0-9]';


SELECT userName
FROM user
WHERE userName RLIKE '^[A-Za-z]{6}$';


SELECT userName, email
FROM user
         JOIN customer ON user.userId = customer.userId
WHERE userName RLIKE '[0-9]$';


SELECT userName, email, userId
FROM user
         JOIN customer ON user.userId = customer.userId
WHERE user.userId BETWEEN 3 AND 7;

SELECT authority, COUNT(*) AS totalUsers
FROM user
GROUP BY authority;






