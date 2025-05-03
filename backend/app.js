const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');

const app = express();
require('dotenv').config();


app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

sequelize.sync().then(() => {
  console.log('Base de données synchronisée');
  
}).catch(err => {
  console.error('Erreur de synchronisation de la base de données:', err);
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Serveur démarré sur http://localhost:${process.env.PORT || 3001}`);
});
