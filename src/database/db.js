import mysql from 'mysql2';

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "UbakeOsamawe12@",
    database: "MuseumAdmin",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database: ", err);
        return;
    }
    console.log("Connected to database!");
});

const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        museum VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        image VARCHAR(255) 
    )
`;

db.query(usersTable, (err) => {
    if (err) {
        console.error("Error creating users table: ", err);
        return;
    }
    console.log("Users table created successfully!");
});

const eventTable = `
    CREATE TABLE IF NOT EXISTS event (
        id INT PRIMARY KEY AUTO_INCREMENT,
        event_name VARCHAR(255) NOT NULL,
        event_picture LONGTEXT,
        event_description TEXT NOT NULL,
        event_date_start DATE NOT NULL,
        event_date_end DATE NOT NULL,
        event_price INT NOT NULL
    )
`;

db.query(eventTable, (err) => {
    if (err) {
        console.error("Error creating event table: ", err);
        return;
    }
    console.log("Event table created successfully!");
});

const cmsTable = `
    CREATE TABLE IF NOT EXISTS cms (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        location VARCHAR(255) NOT NULL,
        image BLOB NOT NULL
    )
`;

db.query(cmsTable, (err) => {
    if (err) {
        console.error("Error creating cms table: ", err);
        return;
    }
    console.log("CMS table created successfully!");
});

export default db;
