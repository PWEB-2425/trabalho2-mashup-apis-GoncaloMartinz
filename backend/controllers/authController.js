const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registro de usuário
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Verifica se usuário já existe
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Cria novo usuário
    const user = await User.create({
      username,
      password: hashedPassword
    });

    // Cria sessão
    req.session.userId = user._id;
    
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Verifica se usuário existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verifica senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Cria sessão
    req.session.userId = user._id;
    
    res.json({ message: 'Login realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout realizado com sucesso' });
  });
};
