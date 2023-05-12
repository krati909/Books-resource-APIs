const mysql = require('mysql');
const bcrypt = require('bcrypt'); // this is encrypting the password and then storing in database.
const jwt = require('jsonwebtoken');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'krati',
    password: 'Krati@123',
    database: 'books',
});

connection.connect();

exports.getUsers = (req, res) => {
    const query = 'SELECT * FROM user';
    connection.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json(rows);
    });
};

exports.getUser = (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM user WHERE id = ${id}`;
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


exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM user WHERE email="${email}"`;
    connection.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Signin first!!' });
        }
        bcrypt.compare(password, rows[0].password, (err, result) => { // comparing the encrypted password from database and password entered
                if (err) {
                    return res.status(404).json({ message: err });
                }
                if (result) {

                    //jwt token
                    const token = jwt.sign({
                        email: email,
                        user_id: rows[0].id

                    }, process.env.JWT_KEY, {
                        expiresIn: '1h'
                    });

                    res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });

                } else {
                    return res.status(404).json({ message: 'Auth failed' });
                }
            })
            // res.status(200).json(rows[0]);
    });
};

exports.createUser = (req, res) => {
    const { name, email, password } = req.body;


    const query = `SELECT * FROM user WHERE email="${email}"`;
    connection.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err });
        }
        if (rows.length === 0) {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {

                    const query = `
                    INSERT INTO user (name, email,password)
                    VALUES (?, ?,?)
                  `;
                    const values = [name, email, hash];
                    connection.query(query, values, (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: err });
                        }
                        res.status(201).json({ id: result.insertId });
                        console.log(result)
                    });

                }

            })
        } else {
            return res.status(500).json({ message: 'Mail already exist' });
        }
        res.status(200).json(rows[0]);
    });




};

exports.updateUser = (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {

            const query = `
        UPDATE user
        SET name = ?, email=?,password=?
        WHERE id = ?`;

            const values = [name, email, hash, id];
            connection.query(query, values, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.status(204).end();
            });

        }

    })




};

exports.deleteUser = (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM user WHERE id = ${id}`;
    connection.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'user not found' });
        }
        res.status(204).end();
    });
};