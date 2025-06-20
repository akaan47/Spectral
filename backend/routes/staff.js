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
    const {isadminlocal ,author_id, user_id, reason } = req.body;
    
    try {
        if (!isadminlocal) {
            return res.status(400).json({ error: 'Vous n\'avez pas la permission de bannir cet utilisateur' });
        }
        if (isadminlocal == 0) {
            return res.status(400).json({ error: 'Vous n\'avez pas la permission de bannir cet utilisateur' });
        }
        if (!author_id || !user_id || !reason) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        if (author_id === user_id) {
            return res.status(400).json({ error: 'Vous ne pouvez pas vous bannir vous-même' });
        }
        if (reason.length < 10) {
            return res.status(400).json({ error: 'La raison doit contenir au moins 10 caractères' });
        }
        const author = await User.findOne({ where: { user_id: author_id } });

        
        if (author.isadmin === 0) {
            return res.status(400).json({ error: 'Vous n\'avez pas la permission de bannir cet utilisateur' });
        }

        const user_ban = await User.findOne({ where: { user_id } });

        if (author.isadmin == 1 && user_ban.isadmin === 1 || user_ban.isadmin === 2) {
            return res.status(400).json({ error: 'Vous ne pouvez pas bannir un administrateur' });
        }

        
        


        const user = await User.findOne({ where: { user_id } });
        if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        if (author.isadmin == 2 && user_ban.isadmin === 1) {
            await User.update({ isadmin: 0 }, { where: { user_id } });
        }
        if (user_ban.isbanned === true) {
            return res.status(400).json({ error: 'Cet utilisateur est déjà banni' });
        }else if (user_ban.isbanned === false) {
            await User.update({ isbanned: true }, { where: { user_id } });
            await User.update({ isbannedreason: reason }, { where: { user_id } });
            return res.status(200).json({ message: 'Utilisateur banni avec succès' });
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
    }
);

router.post('/unbanid', async (req, res) => {
    const {isadminlocal ,author_id, user_id} = req.body;

    const author = await User.findOne({ where: { user_id: author_id } });
    if (!author) {
        return res.status(400).json({ error: 'Auteur non trouvé' });
    }
    if (!isadminlocal) {
        return res.status(400).json({ error: 'Vous n\'avez pas la permission de bannir cet utilisateur' });
    }
    if (isadminlocal == 0 || author.isadmin == 0) {
        return res.status(400).json({ error: 'Vous n\'avez pas la permission de bannir cet utilisateur' });
    }

    const user = await User.findOne({ where: { user_id } });
    if (!user) {
        return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    if (user.isbanned === false) {
        return res.status(400).json({ error: 'Cet utilisateur n\'est pas banni' });
    }

    await User.update({ isbanned: false }, { where: { user_id } });
    await User.update({ isbannedreason: null }, { where: { user_id } });
    res.status(200).json({ message: 'Utilisateur débanni avec succès' });
    console.log('Utilisateur débanni avec succès');
} );

router.post('/rankup', async (req, res) => {
    const {isadminlocal ,author_id, user_id} = req.body;

    const author = await User.findOne({ where: { user_id: author_id } });
    if (!author || !author_id) {
        return res.status(400).json({ error: 'Auteur non trouvé' });
    }
    if (!user) {
        return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }
    if (!isadminlocal) {
        return res.status(400).json({ error: 'Vous n\'avez pas la permission de bannir cet utilisateur' });
    }



    const user = await User.findOne({ where: { user_id } });

  

    await User.update({ isadmin: 1 }, { where: { user_id } });
    res.status(200).json({ message: 'Utilisateur promu avec succès' });
});


router.post('/rankdown', async (req, res) => {
    const {isadminlocal ,author_id, user_id} = req.body;

    const author = await User.findOne({ where: { user_id: author_id } });
    if (!author || !author_id) {
        return res.status(400).json({ error: 'Auteur non trouvé' });
    }
    const user = await User.findOne({ where: { user_id } });
    if (!user) {
        return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }
    if (!isadminlocal) {
        return res.status(400).json({ error: 'Vous n\'avez pas la permission de bannir cet utilisateur' });
    }

    if (author.isadmin == 0 && author.isadmin == 1 && author.isadmin == 1) {
        return res.status(400).json({ error: 'Vous n\'avez pas la permission de rétrograder cet utilisateur' });
    }
    
  

    await User.update({ isadmin: 0 }, { where: { user_id } });
    res.status(200).json({ message: 'Utilisateur rétrogradé avec succès' });
});

module.exports = router;