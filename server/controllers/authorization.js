const express = require("express");
const expressJwt = require("express-jwt");
exports.requireSignIn = expressJwt({secret:process.env.JWT_KEY,algorithms:["HS256"]});
