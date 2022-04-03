const express = require("express");
const UsersController = require("../controllers/users");

const { signUp, signIn } = UsersController;
const api = express.Router();

api.post("/signup", signUp);
api.post("/signin", signIn);

module.exports = api;
