const express = require("express");
const jwt = require("jsonwebtoken");
const twitchStrategy = require("@d-fischer/passport-twitch").Strategy;
const users = require("./db/services/user");
const passport = require("passport");
const router = express.Router();
require('dotenv').config()


  passport.use(
		new twitchStrategy(
			{
				clientID: process.env.TWITCH_ID,
				clientSecret: process.env.TWITCH_SECRET,
				callbackURL: process.env.TWITCH_CALLBACK,
				scope: process.env.TWITCH_SECRET,
			},
			function (accessToken, refreshToken, profile, cb) {
				users.findOrCreate(profile);
				return cb(null, profile);
			}
		)
	);

router.get('/auth', (req, res, next) => {
  const {redirectTo} = req.query;
  const state = JSON.stringify({redirectTo});
  const authenticator = passport.authenticate("twitch", {
		scope: [process.env.TWITCH_SCOPE],
		state,
		session: true,
	});
  authenticator(req,res,next);
}, (req,res,next ) => {
  next();
});

router.get('/auth/callback', passport.authenticate('twitch', {failureRedirect: '/login'}), (req,res,next) => {
  const token = jwt.sign({ id: req.user.id }, process.env.SECRET, {
		expiresIn: 60 * 60 * 24 * 1000,
	});
  req.logIn(req.user, function(err) {
    if (err) return next(err);
    res.redirect(`http://localhost:3000?token=${token}`)
  })
})

module.exports = router;

