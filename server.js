var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");
var passport = require("passport");
var twitchStrategy = require("@d-fischer/passport-twitch").Strategy;
require('dotenv').config();
require('./db/mongoose');
var app = express();
var User = require('./db/models/users');
var profileRoutes = require('./routes/profile-routes');
var authRoutes = require('./routes/auth-routes');
require("./config/passport-setup");

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({maxAge: 24*60*60*1000, secret: "somesecrettokenhere" }));
app.use(passport.initialize());
app.use(express.static("./public"));
app.use(passport.session());
app.set("views", "./views");
app.use(express.static("./public"));
app.set("view engine", "ejs");
passport.serializeUser((user, done) => {
  done(null, user.id);
})

// Routes

app.use('/auth', authRoutes)
app.use('/arena', profileRoutes)

app.get("/", function (req, res) {
	res.render("index", { user: req.user});
});


/* io.on('connection', function(socket) {
  socket.on('entry', (message) => {
    let nsp = io.of(message.room);
    nsp.emit('room', {
      message: message
    })
  })
}) */

app.listen(3000);


/*  let msg = [];

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
 }); */