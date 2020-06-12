const router = require('express').Router()
const User = require('../db/models/users');


const authCheck = (req, res, next) => {
  if(!req.user) {
    res.redirect('/');
  } else {
    next();
  }
}

router.get(`/`, authCheck, (req, res) => {
  res.redirect(`arena/${req.user.displayName.toLowerCase()}`)
})

router.get(`/:id`, async (req, res) => {
  let owner = await User.findOne({
    twitchId: req.params.id
  })
  if (!owner) {
    res.render('404', {user: req.user})
  }
  res.render('profile', {user: req.user, route:req.params.id, owner: owner}) 
})

module.exports = router;