// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ProfilePicture = require('../models/profilePicture');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT;

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
    req.user = user;
    next();
  });
};

router.put('/update', auth, async (req, res) => {
  try {
    const userId = req.user.id; 
    const { username, displayName, email, profilePicture } = req.body;

    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (username !== user.username) {
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà utilisé' });
      }
    }

    if (email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ error: 'Cette adresse email est déjà utilisée' });
      }
    }

    user.username = username || user.username;
    user.displayName = displayName || user.displayName;
    user.email = email || user.email;
    
    if (profilePicture) {
      const existingProfilePic = await ProfilePicture.findOne({ 
        where: { user_id: userId } 
      });
      
      if (existingProfilePic) {
        existingProfilePic.profilePicture = profilePicture;
        await existingProfilePic.save();
      } else {
        await ProfilePicture.create({
          user_id: userId,
          profilePicture: profilePicture
        });
      }
    }

    await user.save();

    const userProfilePic = await ProfilePicture.findOne({ 
      where: { user_id: userId } 
    });

    const newToken = jwt.sign(
      { id: user.user_id, username: user.username, email: user.email },
      SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION || '12h' }
    );

    console.log(userProfilePic)
    res.status(200).json({
      message: 'Informations utilisateur mises à jour avec succès',
      token: newToken,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        profilePicture: userProfilePic.dataValues.profilePicture
      }
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du profil:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
});

module.exports = router;