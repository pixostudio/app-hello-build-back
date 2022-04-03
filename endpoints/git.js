const express = require("express");
const GitController = require("../controllers/git");

const { getReposOwner, getReposFavs } = GitController;
const api = express.Router();

api.post("/owner-repos", getReposOwner);
api.post("/favs-repos", getReposFavs);

module.exports = api;
