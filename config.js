const API_VERSION = "v1";
const PORT = process.env.PORT || 3977;
const PORT_DB = 27017;
const URL_SERVER = "localhost";
const URL_SERVER_MONGO = "localhost";
const URL_FRONT = "localhost";
const URL_BASE_GIT = "https://api.github.com";
const URL_FRONT_PORT = process.env.PORT_FRONT || 3000;
const NAME_DB = "repo-app-db";
const SECRET_KEY = "734A7C46D56EC1321573537216AF1";
const GITHUB_CLIENT_ID = "11598553a32e896f152c";
const GITHUB_CLIENT_SECRET = "09d78197a393b27f9aab38cdafe8de226bbc69ba";

module.exports = {
  API_VERSION,
  PORT,
  PORT_DB,
  URL_SERVER,
  URL_SERVER_MONGO,
  URL_FRONT,
  URL_FRONT_PORT,
  NAME_DB,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SECRET_KEY,
  URL_BASE_GIT,
};