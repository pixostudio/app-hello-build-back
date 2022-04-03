const FormData = require("form-data");
const fetch = require('node-fetch');
const jwt = require("../services/jwt");
const User = require("../models/users");
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, URL_FRONT, URL_FRONT_PORT, URL_BASE_GIT } = require("../config");

const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    const isTokenExp = jwt.willExpiredToken(refreshToken);
    if (isTokenExp) {
      res.status(500).send({ message: 'Ha expirado la sesión' });
    } else {
      const { id } = jwt.decodeToken(refreshToken);
      User.findOne({ id }, (err, user) => {
        if (err) {
          res.status(500).send({ message: `Error interno del servidor ${err}` });
        } else if (!user || !user.active) {
          res.status(400).send({ message: `Usuario no existe` });
        } else {
          res.status(200).send({ message: `Usuario logueado`, token: {
            accessToke: jwt.createAccessToken(user),
            refreshToken
          }});
        }
      })
    }
  } else {
    res.status(500).send({ message: 'Faltan parametros' });
  }
}

const authGitHub = (req, res) => {
  const { code } = req.body;
  const uri = "https://github.com/login/oauth/access_token";
  let access_token;

  const data = new FormData();
  data.append("client_id", GITHUB_CLIENT_ID);
  data.append("client_secret", GITHUB_CLIENT_SECRET);
  data.append("code", code);
  data.append("redirect_uri", `http://${URL_FRONT}:${URL_FRONT_PORT}/iniciar-sesion`);

  fetch(`${uri}`, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      let params = new URLSearchParams(paramsString);
      access_token = params.get("access_token");
      
      return fetch(`${URL_BASE_GIT}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) => response.json())
    .then((response) => createOrUpdateUserWithGitHub(response, access_token, res))
    .catch((error) => {
      res.status(500).send({ message: `Error interno del servidor ${error}` });
    });
}

const createOrUpdateUserWithGitHub = (dataGit, access_token, res) => {
  const user = {
    name: dataGit.name,
    userName: dataGit.login,
    email: dataGit.email,
    githubId: dataGit.id,
    accessTokenGitHub: access_token
  };

  User.findOne({ userName: user.userName }, (err, userStorage) => {
    if (err) {
      res.status(500).send({ message: `Error interno del servidor ${err}` });
    } else if (!userStorage || !userStorage.active) {
      let userNew = new User(user);

      userNew.active = true;
      userNew.email = user.email ? user.email.toLowerCase() : '';

      userNew.save((error, userCreate) => {
        if (error) {
          res.status(500).send({ message: `Fallo al crear usuario motivo: ${error}` })
        } else if (!userCreate) {
          res.status(400).send({ message: `Fallo al crear usuario` })
        } else {
          res.status(200).send({ message: `Usuario creado y logueado`, token: setTokens(userNew) })
        }
      });
    } else if (!userStorage.githubId) {
      User.findOneAndUpdate({ userName: user.userName }, {githubId: user.githubId, accessTokenGitHub: user.accessTokenGitHub}, (err, userUpdate) => {
        if (err) {
          res.status(500).send({ message: `Fallo al actualizar usuario motivo: ${error}` })
        } else if (!userUpdate) {
          res.status(400).send({ message: `Fallo al actualizar usuario` })
        } else {
          res.status(200).send({ message: `Usuario actualizado y logueado`, token: setTokens(userUpdate) })
        }
      })
    } else {
      User.findOneAndUpdate({ userName: user.userName }, {accessTokenGitHub: user.accessTokenGitHub}, (err, userUpdate) => {
        if (err) {
          res.status(500).send({ message: `Fallo al actualizar usuario motivo: ${error}` })
        } else if (!userUpdate) {
          res.status(400).send({ message: `Fallo al actualizar usuario` })
        } else {
          res.status(200).send({ message: `Usuario actualizado y logueado`, token: setTokens(userUpdate) })
        }
      })
    }
  });
}

const setTokens = (user) => {
  return {
    accessToken: jwt.createAccessToken(user),
    refreshToken: jwt.createRefreshToken(user),
  }
};

module.exports = {
  refreshToken,
  authGitHub,
};
