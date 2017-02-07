let pollId = window.location.href.match(/[^\/]*$/)[0]
const socket = io();
const connectionCount = document.getElementById('connection-count');
let avatar
let nickname

$(document).ready(function() {
 if(localStorage.getItem('id_token') !== null) {
   let profileData = JSON.parse(localStorage.getItem('profile'))
   avatar = profileData.picture
   nickname = profileData.nickname
 }
 })

$.get(`/polls/${pollId}`, function(poll){
  poll.forEach(poll => {
    $('.poll-name').text(poll.name)
    $('.opt-one-text').text(poll.opt_one)
    $('.opt-two-text').text(poll.opt_two)
    $('.opt-three-text').text(poll.opt_three)
    $('.opt-four-text').text(poll.opt_four)
  })
})

function getPollById(id, response) {
  database('polls').select().table('polls').where('id', id)
    .then(function(poll) {
      response.status(200).json(poll);
    })
    .catch(function(error) {
      console.error(error)
    })
}

socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});

const statusMessage = document.getElementById('status-message');

const buttons = document.querySelectorAll('#choices button');

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast', i, avatar, nickname);
  });
}

socket.on('voteCount', (votes) => {
  console.log(votes);
  votes.forEach((user, index) => {
    if(user.length){
      $(`.${user[0].nickname}`).remove()
      $(`.avatar-vote-${index + 1}`).prepend(
        `<img class='vote-avatar ${user[0].nickname}' src=${user[0].avatar}/>`
      );
    }
  })
});
