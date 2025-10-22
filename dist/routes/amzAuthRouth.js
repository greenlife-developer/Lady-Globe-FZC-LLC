var expressAmzAuth = require("express");
var amzAuthRouter = expressAmzAuth.Router();
var amazonAuthCallback = require("../controllers/amazonAuth").amazonAuthCallback;
amzAuthRouter.get("/auth/amazon/callback", amazonAuthCallback);
;
module.exports = amzAuthRouter;
