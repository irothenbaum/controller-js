const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const socketServer = require('./socketServerSingleton')
const TwigRender = require('./helpers/twigRender')
const fs = require('fs')
const auth = require('./auth.json')

const HTTP_PORT = 80
const HTTPS_PORT = 443

const app = express();

let server
if (auth.protocol === 'http') {
    server = require('http').createServer(app)
} else if (auth.protocol === 'https') {
    server = require('https').createServer({
        key: fs.readFileSync(auth.ssl.key, 'utf8'),
        cert: fs.readFileSync(auth.ssl.cert, 'utf8'),
        ca: auth.ssl.chain ? fs.readFileSync(auth.ssl.chain, 'utf8') : null
    }, app)

    // force https
    let httpApp = express()
    httpApp.use(function(req, res, next) {
        if(!req.secure) {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        next();
    })
    let httpServer = require('http').createServer(httpApp)
    httpServer.listen(HTTP_PORT)
} else {
    throw new Error("Invalid protocol")
}

socketServer(app, server)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    TwigRender(res, 'error')
});

server.listen(auth.protocol === 'https' ? HTTPS_PORT : HTTP_PORT)

module.exports = app;
