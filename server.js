var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");
var passport = require("passport");
require('dotenv').config();
require('./db/mongoose');
var profileRoutes = require('./routes/profile-routes');
var authRoutes = require('./routes/auth-routes');
require("./config/passport-setup");
var port = process.env.PORT;
var path = require('path');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http)
var charList = require("./public/charList.json")
var User = require('./db/models/users');

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({maxAge: 24*60*60*1000, secret: process.env.SECRET }));
app.use(passport.initialize());
//app.use(express.static("./public"));
app.use(
	express.static(
		"./.well-known/acme-challenge/6cPdrOBny_cG8TUd_sjDJQUQAScdNmZ2eQ5-Q-SyeF0/",
		{ dotfiles: "allow" }
	)
);
app.use('/', (req,res) => {
  res.send(
		"6cPdrOBny_cG8TUd_sjDJQUQAScdNmZ2eQ5-Q-SyeF0.n_YKAvCWl3uBTVsO2DNKakL3WKe20_7McDyBTzfiCjc"
	);
})
app.use(passport.session());
app.set("views", "./views");
app.set("view engine", "ejs");
passport.serializeUser((user, done) => {
  done(null, user.id);
})



// Routes
app.use('/auth', authRoutes)
app.use('/arena', profileRoutes)
app.get("/", async function (req, res) {
  // Grab Latest Members
  let members = await User.find({}, function(err, result) {
    if (err) {
      console.log(err)
    } else {
      return result
    }
  })
	res.render("index", { user: req.user, members: members });
});
// Sockets
var roomList = {}

io.on("connection", (socket) => {
  console.log(`Connected`);
  socket.on('join room', (data) => {
    socket.join(data.room);
    if (!roomList[data.room]) {
      roomList[data.room] = {};
      roomList[data.room].lobby = []
      roomList[data.room].room = {}
		}
    console.log(`Joined ${data.room}`)
    io.sockets.to(data.room).emit("room", roomList[data.room])
  })

  socket.on('send', (data) => {
    if (!roomList[data.room]) {
      roomList[data.room] = {}
      roomList[data.room].lobby = []
      roomList[data.room].lobby.push(data)
    }

    if (data.nickname && data.nickname.length > 10) {
      return
    }

    let checkChar = charList.fighters.find(x => x.name == data.character)
    if (!checkChar) {
      return
    }

    let checkUser = roomList[data.room].lobby.find(x => x.user == data.user);
    if (checkUser) {
      let index = roomList[data.room].lobby.indexOf(checkUser);
      if (index !== -1) {
        roomList[data.room].lobby[index] = {
					user: data.user,
					character: data.character,
					nickname: data.nickname,
					room: data.room,
				};
      }
      return io.sockets.to(data.room).emit("room", roomList[data.room]);
    }
    roomList[data.room].lobby.push(data);
    io.sockets.to(data.room).emit("room", roomList[data.room]);
  })
  socket.on('update', data => {
    if (!roomList[data.room]) {
			roomList[data.room] = {};
			roomList[data.room].lobby = [];
			roomList[data.room].room = {};
		}
    roomList[data.room].room = data
    return io.sockets.to(data.room).emit("update room", roomList[data.room]);
  })
  socket.on('kick', data => {
    if (!roomList[data.room]) {
			roomList[data.room] = {};
			roomList[data.room].lobby = [];
			roomList[data.room].room = {};
		}
    let checkUser = roomList[data.room].lobby.find(x => x.user == data.username);
    if (checkUser) {
      let index = roomList[data.room].lobby.indexOf(checkUser);
      if (index > -1) {
        roomList[data.room].lobby.splice(index, 1)
        return io.sockets.to(data.room).emit('update list', roomList[data.room])
      }
      return io.sockets.to(data.room).emit("update list", roomList[data.room]);
    }
  })
  socket.on('clear', data => {
    if (!roomList[data.room]) {
			roomList[data.room] = {};
			roomList[data.room].lobby = [];
			roomList[data.room].room = {};
    }
    roomList[data.room].lobby = [];
    roomList[data.room].room = data
    return io.sockets.to(data.room).emit('remove lobby', roomList[data.room]);
    
  })
});

http.listen(port, ()=> {
  console.log(`Server is running on: ${port}`)
});