const User = require("../models/users");
const bcrypt = require('bcrypt-nodejs');
const jwt = require("../services/jwt");

const signUp = (req, res) => {
  const data = req.body;
  User.findOne({ userName: data.userName }, (err, userStorage) => {
    if (err) {
      res.status(500).send({ message: `Error interno del servidor ${err}` });
    } else if (!userStorage || !userStorage.active) {
      let userNew = new User(data);

      userNew.active = true;
      bcrypt.hash(data.password, null, null, (error, hash) => {
        if (error) {
          res.status(500).send({ message: `Fallo al crear usuario motivo: ${error}` })
        } else {
          userNew.password = hash;
        }
      });
      userNew.email = data.email.toLowerCase();
      userNew.save((error, userCreate) => {
        if (error) {
          res.status(500).send({ message: `Fallo al crear usuario motivo: ${error}` })
        } else if (!userCreate) {
          res.status(400).send({ message: `Fallo al crear usuario` })
        } else {
          res.status(200).send({ message: `Usuario creado`, token: setTokens(userCreate) })
        }
      });
    } else {
      res.status(500).send({
        message: `Fallo al crear usuario, ya existe`
      })
    }
  });
}

const signIn = (req, res) => {
  const data = req.body;
  User.findOne({ userName: data.userName }, (err, user) => {
    if (err) {
      res.status(500).send({ message: `Error interno del servidor ${err}` });
    } else if (!user) {
      res.status(400).send({ message: `Usuario no existe` });
    } else if (!user.active) {
      res.status(400).send({ message: `Usuario no existe` });
    } else {
      bcrypt.compare(data.password, user.password, (err, check) => {
        if (err) {
          res.status(500).send({ message: `Error interno del servidor ${err}` });
        } else if (!check) {
          res.status(400).send({ message: `Datos erroneos` });
        } else {
          res.status(200).send({ message: `Usuario logueado`, token: setTokens(user) })
        }
      });
    }
  });
};

const setTokens = (user) => {
  return {
    accessToken: jwt.createAccessToken(user),
    refreshToken: jwt.createRefreshToken(user),
  }
};

module.exports = {
  signUp,
  signIn,
};