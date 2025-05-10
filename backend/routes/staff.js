const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const ProfilePicture = require('../models/profilePicture');
const router = express.Router();
const generateID = require('../functions/generateID');

const { body, validationResult } = require('express-validator');



const jwt = require('jsonwebtoken');
const { route } = require('./auth');
const SECRET_KEY = process.env.JWT;


router.post('test', async (req, res) => {
    return res.status(200).json({ message: 'ok' });
    console.log('ok');      
} );

router.post('/banid', async (req, res) => {
    const {author_id, user_id, reason } = req.body;
    
    try {
        if (!author_id || !user_id || !reason) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        if (author_id === user_id) {
            return res.status(400).json({ error: 'Vous ne pouvez pas vous bannir vous-même' });
        }
        const author = await User.findOne({ where: { user_id: author_id } });

        console.log(author, user_id, reason);


        const user = await User.findOne({ where: { user_id } });
        if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    
        await User.update({ isbanned: true }, { where: { user_id } });
        await User.update({ reason: reason }, { where: { user_id } });
        return res.status(200).json({ message: 'Utilisateur banni avec succès' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
    }
);

module.exports = router;