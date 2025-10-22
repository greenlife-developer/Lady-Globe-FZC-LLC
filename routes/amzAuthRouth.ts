const expressAmzAuth = require("express");
const amzAuthRouter = expressAmzAuth.Router();

const {
  amazonAuthCallback,
} = require("../controllers/amazonAuth");

amzAuthRouter.get("/auth/amazon/callback", amazonAuthCallback);;


module.exports = amzAuthRouter;
