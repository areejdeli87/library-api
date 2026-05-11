const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Génère un token JWT avec id et role
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    // Vérifie si l'email existe déjà
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email déjà utilisé' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id, user.role);

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const token = signToken(user._id, user.role);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};