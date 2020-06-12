const passport = require("passport");
const twitchStrategy = require("@d-fischer/passport-twitch").Strategy;
const User = require('../db/models/users');
require('dotenv').config();

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