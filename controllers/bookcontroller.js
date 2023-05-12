const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'krati',
    password: 'Krati@123',
    database: 'books',
});

connection.connect();

exports.getBooks = (req, res) => {
    const query = 'SELECT * FROM book';
    connection.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json(rows);
    });
};

exports.getBook = (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM book WHERE id = ${id}`;
    connection.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(rows[0]);
    });
};

exports.createBook = (req, res) => {
    const { name, image_url, author, pages, price } = req.body;
    const query = `
    INSERT INTO book (name, image_url, author, pages, price)
    VALUES (?, ?, ?, ?, ?)
  `;
    const values = [name, image_url, author, pages, price];
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err });
        }
        res.status(201).json({ id: result.insertId });
    });
};

exports.updateBook = (req, res) => {
    const id = req.params.id;
    const { name, image_url, author, pages, price } = req.body;
    const query = `
    UPDATE book
    SET name = ?, image_url = ?, author = ?, pages = ?, price = ?
    WHERE id = ?
  `;
    const values = [name, image_url, author, pages, price, id];
    connection.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(204).end();
    });
};

exports.deleteBook = (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM book WHERE id = ${id}`;
    connection.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(204).end();
    });
};