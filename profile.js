const express = require('express');
const userService = require('./db/services/user');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const router = express()

router.use((req, res, next) => {
  const token = req.headers["authorization"];
  console.log(req.headers)
  jwt.verify(token, process.env.SECRET, function (err, data) {
		if (err) {
			res.status(401).send({ error: "Not Authorized" });
		} else {
			req.user = data;
			next();
		}
	});
})

router.get('/', async (req, res) => {
  user = await userService.findById(req.user.id)
  res.send(user)
})

module.exports = router;