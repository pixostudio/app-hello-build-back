const express = require("express");
const AuthController = require("../controllers/auth");

const { refreshToken, authGitHub } = AuthController;
const api = express.Router();

api.post("/refresh-token", refreshToken);
api.post("/oauth-github", authGitHub);

module.exports = api;
