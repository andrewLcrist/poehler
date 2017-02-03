const express = require('express');
const http = require("http");
const app = express();
const bodyParser = require('body-parser');
const md5 = require('md5');
const path = require('path');
const shortid = require('shortid');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const knex = require('knex')(configuration);
const helpers = require('./helpers.js')
const fs = require('fs')
const socketIo = require('socket.io');
require('dotenv').config()
const port = process.env.PORT || 3000;

const server = http.createServer(app)
                 .listen(port, () => {
                    console.log(`Listening to port ${port}.`);
                  });

const io = socketIo(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.title = 'Poehler'

app.use(express.static(path.join(__dirname, '/public')))

app.use('/form', (request, response) => {
  response.sendFile(__dirname + '/public/creation.html')
})

app.use('/poll', (req, res) => {
  res.sendFile(__dirname + '/public/poll.html')
});

app.get('/polls', (request, response) => {
  helpers.getPolls(response)
})

app.get('/polls/:id', (request, response) => {
  const { id } = request.params
  helpers.getPollById(id, response)
})

app.get('/authkeys', (req, res) => {
  authId = process.env.AUTH0_CLIENT_ID
  authDomain = process.env.AUTH0_DOMAIN
  res.status(200).json({authId, authDomain})
})

app.post('/polls', (request, response) => {
  const poll = request.body.poll
  const opt_one = request.body.opt_one
  const opt_two = request.body.opt_two
  const opt_three = request.body.opt_three
  const opt_four = request.body.opt_four
  const poll_id = shortid.generate()
  helpers.postNewPoll(poll, opt_one, opt_two, opt_three, opt_four, poll_id, response);
})

//sockets codes
app.locals.voteCount = [
  [],
  [],
  [],
  []
]


io.on('connection', (socket) => {
  let voteCount = app.locals.voteCount

  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('disconnect', () => {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete voteCount[socket.id];
    socket.emit('voteCount', voteCount);
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });

  socket.on('message', (channel, index, user, nickname) => {
    if (channel === 'voteCast') {
      assignUser(user, index, nickname)
      io.sockets.emit('voteCount', voteCount);
    }
    function assignUser(avatar, index, nickname) {
      voteCount = voteCount.map(function(eachArray) {
        return eachArray.filter(function(user) {
          return avatar.user_id != user.user_id
        })
      })
      voteCount[index].push({avatar, nickname})
      app.locals.voteCount = voteCount;
    }
  });
});

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '/public/', '404.html'));
})

module.exports = server
