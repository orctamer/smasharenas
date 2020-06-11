
const express = require("express");
const passport = require('passport');
const bodyParser = require('body-parser');
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require('./db/mongoose');
const auth = require('./auth.js')
const profile = require('./profile.js')
let port = 3000

nextApp.prepare().then(() => {
  const app = express();
  const server = require("http").Server(app);
  const io = require("socket.io")(server);
  app.use(passport.initialize());
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  passport.serializeUser(function (user, cb) {
		cb(null, user);
	});
  app.use('/', auth);
  app.use('/user', profile);
  app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    next();
  });
  let msg = [];

	io.on("connect", (socket) => {
		socket.emit("now", {
			message: "zeit",
		});
		if (!msg === undefined || !msg.length == 0) {
			socket.emit("chat", {
				messages: msg,
			});
		}
		socket.on("hello", (message) => {
			msg.push(message);
			console.log(msg);
			io.emit("chat", {
				messages: msg,
			});
		});
	});

  app.get("*", (req, res) => {
		handle(req, res);
	});

	app.listen(port, () =>
		console.log(`Server listening on http://localhost:${port}`)
	);  
});


