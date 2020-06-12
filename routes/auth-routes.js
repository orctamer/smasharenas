const router = require('express').Router()
const passport = require('passport');

//auth logout 

router.get('/logout', (req,res) => {
  req.logout();
  var redirectRoute = req.headers.referer
  res.redirect(redirectRoute);
})

const authCheck = (req, res, next) => {
  if(!req.user) {
    res.redirect('/');
  } else {
    next();
  }
}

// auth with twitch

router.get("/login", passport.authenticate("twitch"));
router.get(
	"/callback",
	passport.authenticate("twitch", { failureRedirect: "/" }),
	function (req, res) {
    var redirectRoute = req.headers.referer || `/arena/${req.user.twitchId}`
    // Successful authentication, redirect arena.
    res.redirect(redirectRoute)
	}
);

/* router.get(`/arena/:name`, (req, res) => {
  return res.send(`Here is is ${req.user} and ${req.params.name}`)
  res.render('profile', {user: req.user, route: req.params.name})
}) */

module.exports = router