const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const ProfilePicture = require('../models/profilePicture');
const router = express.Router();
const generateID = require('../functions/generateID');

const { body, validationResult } = require('express-validator');



const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT;


router.post('/signup', 
  [
    body('email').isEmail().withMessage('Email invalide'),

    body('password').notEmpty().withMessage('Le mot de passe est requis'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères'),
    body('password').isLength({ max: 32 }).withMessage('Le mot de passe doit faire au plus 32 caractères'),

    body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis'),
    body('username').isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit faire au moins 3 caractères'),
    body('username').isLength({ max: 32 }).withMessage('Le nom d\'utilisateur doit faire au plus 32 caractères'),

    body('displayName').notEmpty().withMessage('Le nom d\'affichage est requis'),
    body('displayName').isLength({ min: 3 }).withMessage('Le nom d\'affichage doit faire au moins 3 caractères'),
    body('displayName').isLength({ max: 32 }).withMessage('Le nom d\'affichage doit faire au plus 32 caractères'),
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, displayName, email, password } = req.body;
    
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
      }

      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ error: 'Nom d\'utilisateur déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        user_id: String(generateID("user")),
        username,
        displayName,
        email,
        password: hashedPassword,
        isadmin: false,
        isbanned: false,
        isbannedreason: null,
      });

      res.status(201).json({ ok: true, message: 'Utilisateur créé avec succès !', user });
    } catch (err) {
      console.error(err); 
      res.status(500).json({ ok: false, error: err.message });
    }
  }
);


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

     const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username, email: user.email, isadmin: user.isadmin, isbanned: user.isbanned },
      SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION || '12h' }
    );
    const userProfilePic = await ProfilePicture.findOne({ 
      where: { user_id: user.user_id } 
    });

    res.status(200).json({
      message: 'Connexion réussie',
      token, 
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        isadmin: user.isadmin,
        isbanned: user.isbanned,
      }
    });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
