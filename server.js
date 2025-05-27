const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./database.db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Crear tabla
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// Crear usuario solo si no existe
db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
  if (err) {
    console.error(err);
  } else if (!row) {
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', '1234']);
    console.log('Usuario admin creado.');
  } else {
    console.log('Usuario admin ya existe.');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err) return res.status(500).send('Error en el servidor');
    if (!user) return res.status(401).send('Credenciales incorrectas');

    res.redirect('../../index.html');
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
