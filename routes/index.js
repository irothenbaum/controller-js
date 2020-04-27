const express = require('express');
const asyncHandler = require('express-async-handler')
const TwigRender = require('../helpers/twigRender')
const GameController = require('../controllers/GameController')

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    TwigRender(res, 'index')
});

/* GET example game */
router.get('/example', function(req, res, next) {
    TwigRender(res, 'example')
});

/* GET example game */
router.get('/play/:code', function(req, res, next) {
    TwigRender(res, 'play', {
        connectCode: req.params.code
    })
});

router.get('/debug', GameController.debugSockets)

// ---------------------------------------

/**
 * WEB SOCKET: game connect
 */
router.ws('/game/init/', GameController.socketGameInit)
router.ws('/game/init/:code', GameController.socketGameInit)

/**
 * WEB SOCKET: controller connect
 */
router.ws('/game/:code/connect', GameController.socketConnectController)

module.exports = router;
