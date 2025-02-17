const express = require('express');
const jwt = require('jsonwebtoken');
//const bodyParser = require('body-parser');


const app = express();
const PORT = 3003;
const SECRET_KEY = 'mi_clave_secreta';
app.use(express.json());
app.use(express.static('public'));

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/protected', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no enviado' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Fallo de autenticación' });
    }

    res.json({ mensaje: 'CONTENIDO PROTEGIDO', user: decoded });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


