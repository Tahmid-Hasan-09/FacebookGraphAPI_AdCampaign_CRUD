const express = require("express");
const router = new express.Router();
const facebookRoutes = require("./facebook");

router.use(facebookRoutes);

module.exports = router;
