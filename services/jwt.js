const jwt = require("jwt-simple");
const moment = require("moment");
const { SECRET_KEY } = require("../config") ;

function createAccessToken(user) {
  const payload = {
    id: user._id,
    name: user.name,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    githubId: user.githubId,
    active: user.active,
    createToken: moment().unix(),
    exp: moment().add(3, "hours").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);  
};

function createRefreshToken(user) {
  const payload = {
    id: user._id,
    exp: moment().add(30, "days").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);  
};

function decodeToken(token) {
  return jwt.decode(token, SECRET_KEY, true);
}

function willExpiredToken(token) {
  const { exp } = decodeToken(token);
  const now = moment().unix();

  return now > exp;
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  decodeToken,
  willExpiredToken,
};
