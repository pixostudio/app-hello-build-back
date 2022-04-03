const User = require("../models/users");
const fetch = require('node-fetch');
const { URL_BASE_GIT } = require("../config");

const getReposOwner = (req, res) => {
  const { githubId } = req.body;
  User.findOne({ githubId }, (err, userStorage) => {
    if (err) {
      res.status(500).send({ message: `Ha ocurrido un error motivo: ${err}` })
    } else if (!userStorage) {
      res.status(400).send({ message: `Usuario no existe` })
    } else {
      const accessToken = userStorage.accessTokenGitHub;
      fetch(`${URL_BASE_GIT}/user/repos`, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      })
      .then((response) => response.json())
      .then((response) => {
        res.status(200).send({ repositories: response });
      })
    }
  })
}

const getReposFavs = (req, res) => {
  const { githubId } = req.body;
  User.findOne({ githubId }, (err, userStorage) => {
    if (err) {
      res.status(500).send({ message: `Ha ocurrido un error motivo: ${err}` })
    } else if (!userStorage) {
      res.status(400).send({ message: `Usuario no existe` })
    } else {
      const accessToken = userStorage.accessTokenGitHub;
      fetch(`${URL_BASE_GIT}/user/starred`, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      })
      .then((response) => response.json())
      .then((response) => {
        res.status(200).send({ repositories: response });
      })
    }
  })
}

module.exports = {
  getReposOwner,
  getReposFavs,
};
