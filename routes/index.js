const express = require('express');
const asyncHandler = require('express-async-handler')
const TwigRender = require('../helpers/twigRender')
const GameController = require('../controllers/GameController')

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("LANDING PAGE")
    TwigRender(res, 'index')
});

/**
 * WEB SOCKET: game connect
 */
router.ws('/game/init/:code?', asyncHandler(GameController.socketGameInit))

/**
 * WEB SOCKET: controller connect
 */
router.ws('/game/:code/connect', asyncHandler(GameController.socketConnectController))

module.exports = router;
