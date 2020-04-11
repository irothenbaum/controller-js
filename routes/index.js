const express = require('express');
const asyncHandler = require('express-async-handler')
const TwigRender = require('../helpers/twigRender')
const GameController = require('../controllers/GameController')

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    TwigRender(res, 'index')
});

/**
 * WEB SOCKET: game connect
 */
router.ws('/game/init', asyncHandler(GameController.wsGameInit))

/**
 * WEB SOCKET: controller connect
 */
router.ws('/game/:code/connect', asyncHandler(GameController.wsConnectController))

module.exports = router;
