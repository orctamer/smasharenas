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
var authRoutes = require('./routes/dashboard-routes');

// NextJS

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

passport.deserializeUser((id, done) => {
  User.findById(id).then((user)=> {
    done(null, user);
  })
})

passport.use(
	new twitchStrategy(
		{
			clientID: process.env.TWITCH_ID,
			clientSecret: process.env.TWITCH_SECRET,
			callbackURL: process.env.TWITCH_CALLBACK,
			scope: process.env.SCOPE,
		},
		function (accessToken, refreshToken, profile, done) {
      // Suppose we are using mongo..
      User.findOne({
				twitchId: profile.id
			}).then((currentUser) => {
        if (currentUser) {
          // do stuff
          done(null,currentUser)
          console.log(`Found User: ${currentUser.displayName}`)
        } else {
            new User({
              twitchId: profile.id,
              displayName: profile.display_name,
              profileImage: profile.profile_image_url,
            })
              .save()
              .then((newUser) => {
                console.log(`Username created : ${newUser}`);
                done(null, newUser)
              });
        }
      })
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

// Routes

app.use('/dashboard/', authRoutes)

app.get("/", function (req, res) {
	res.render("index", { user: req.user });
});

app.get("/auth/", passport.authenticate("twitch"));
app.get(
	"/auth/callback",
	passport.authenticate("twitch", { failureRedirect: "/" }),
	function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard/')
	}
);

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