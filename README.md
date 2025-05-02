# ⚠️ ⚠️ ⚠️ `Projet en cours de développement`

# 🔐 Template - Page de Création de Compte & Connexion

**Stack : React / Express / MariaDB(Or MySQL)**

## ✨ Description

Ce projet est un template complet pour gérer l'authentification d'utilisateurs avec un **système d'identifiants unique et logique**, incluant une interface de **création de compte** et de **connexion**.

* 🔧 **Back-end** optimisé avec Express & JWT
* 🎨 **Front-end** moderne avec React
* 📀 **Base de données** MariaDB optimisée :

  * Table `Users` : informations utilisateur
  * Table `profilePictures` : stockage des photos de profil en base64

---

## ⚙️ Configuration

### 🛠️ Pré-requis

* Node.js (>= 18.x recommandé)
* MariaDB ou MySQL
* Yarn ou npm

### 📂 Configuration environnementale

Modifier le fichier `.env` à la racine du dossier `backend` :

```env
PORT=3001
JWT=your_secret_key
JWT_EXPIRATION=12h
```

> ⚠️ **Important** : N'oubliez pas de personnaliser le `JWT_SECRET` et la durée d'expiration du token.

### 🔧 Connexion à la base de données

Modifiez les informations de connexion dans le fichier :
`backend/config/db.js`

```js
const sequelize = new Sequelize('social', 'user', 'password', {
  host: 'HOST', 
  dialect: 'mysql',
});
```

---

## 🧱 Base de données

Avant de lancer l'application, créez une base de données nommée **`social`** dans votre système MariaDB/MySQL :

```sql
CREATE DATABASE social;
```

Deux tables principales seront créées automatiquement ou à l'aide d'un script SQL fourni.

---

## ▶️ Démarrage

### 1. Backend

```bash
cd backend
npm install
node app.js
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📸 Gestion des Photos de Profil

Les images de profil sont stockées en base64 dans une table dédiée pour garantir une séparation propre des responsabilités.
