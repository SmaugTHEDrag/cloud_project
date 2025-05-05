const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: '*', // Allows all origins, or you can specify a specific URL like 'http://group-alb-1865585642.us-east-1.elb.amazonaws.com'
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// const corsOptions = {
//     origin: '*', // You can also specify 'http://group-alb-1865585642.us-east-1.elb.amazonaws.com' for more security
//     methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Make sure OPTIONS is allowed
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     preflightContinue: false, // Pass control to the next middleware
//     optionsSuccessStatus: 204 // Some legacy browsers might not accept 200 for OPTIONS requests
// };

// app.use(cors(corsOptions));

// // Enable CORS preflight for any other non-GET/POST/DELETE/PATCH methods
// app.options('*', cors(corsOptions));


  app.use(express.json());

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'group3-rds-mysql.cuv3amhsli0d.us-east-1.rds.amazonaws.com',
    user: 'group3',      // Thay bằng username của bạn
    password: 'gowiththeflow',      // Thay bằng password của bạn
    database: 'BookInventory',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Kết nối MySQL thành công!');
});

// // API Test
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });
app.post('/upload-book', (req, res) => {
    const { bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL } = req.body;
    const sql = `INSERT INTO Books (bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Sách đã được thêm!', bookId: result.insertId });
    });
});
app.get('/all-books', (req, res) => {
    const sql = "SELECT * FROM Books";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
app.patch('/book/:id', (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    let updateQuery = "UPDATE Books SET ";
    let updateValues = [];
    Object.keys(updateFields).forEach((key, index) => {
        updateQuery += `${key} = ?${index < Object.keys(updateFields).length - 1 ? ', ' : ' '}`;
        updateValues.push(updateFields[key]);
    });
    updateQuery += "WHERE id = ?";

    db.query(updateQuery, [...updateValues, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Cập nhật sách thành công!' });
    });
});
app.delete('/book/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Books WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Sách đã bị xóa!' });
    });
});
app.get('/book/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM Books WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0]);
    });
});
app.post('/upload-favorite-book', (req, res) => {
    const { bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL } = req.body;
    const sql = `INSERT INTO BooksFavorite (bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Sách yêu thích đã được thêm!', bookId: result.insertId });
    });
});
app.get('/all-favorite-books', (req, res) => {
    const sql = "SELECT * FROM BooksFavorite";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
app.delete('/favorite-book/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM BooksFavorite WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Sách yêu thích đã bị xóa!' });
    });
});

const path = require('path');

// Serve static React files
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ==================================== //
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});