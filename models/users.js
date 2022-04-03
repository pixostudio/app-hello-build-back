const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = Schema({
  name: String,
  lastName: String,
  userName: {
    type: String,
    unique: true,
  },
  email: String,
  password: String,
  githubId: String,
  accessTokenGitHub: String,
  active: Boolean,
});

module.exports = mongoose.model("Users", UsersSchema);
