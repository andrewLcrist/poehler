var pollId = window.location.href.match(/[^\/]*$/)[0]

const socket = io();
const connectionCount = document.getElementById('connection-count');
var avatar
var nickname

$(document).ready(function() {
  $.get('/authkeys')
  .then(secrets => {
    doAuth(secrets)
  })

  const doAuth = (secrets) => {
    var lock = new Auth0Lock(secrets.authId, secrets.authDomain, {
      auth: {
        params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes
      }
    });

    $('.btn-login').click(function(e) {
      e.preventDefault();
      lock.show();
    });

    $('.btn-logout').click(function(e) {
      e.preventDefault();
      logout();
    })

    lock.on("authenticated", function(authResult) {
      lock.getProfile(authResult.idToken, function(error, profile) {
        if (error) {
          // Handle error
          return;
        }
        localStorage.setItem('id_token', authResult.idToken);
        // Display user information
        show_profile_info(profile);
      });
    });

    //retrieve the profile:
    var retrieve_profile = function() {
      var id_token = localStorage.getItem('id_token');
      if (id_token) {
        lock.getProfile(id_token, function (err, profile) {
          if (err) {
            return alert('There was an error getting the profile: ' + err.message);
          }
          // Display user information
          saveAvatar(profile);
          show_profile_info(profile);
        });
      }
    };

    var logout = function() {
      localStorage.removeItem('id_token');
      window.location.href = "https://www.youtube.com/watch?v=PwjY6s7yfSk&t=38s";
    };

    retrieve_profile();
  }
});

var show_profile_info = function(profile) {
   $('.nickname').text(profile.nickname);
   $('.btn-login').hide();
   $('.avatar').attr('src', profile.picture).show();
   $('.btn-logout').show();
};

var saveAvatar = function(profile) {
  avatar = profile.picture
  nickname = profile.nickname
}

$.get(`/polls/${pollId}`, function(poll){
  poll.forEach(poll => {
    $('.poll-name').text(poll.name)
    $('.opt-one-text').text(poll.opt_one)
    $('.opt-two-text').text(poll.opt_two)
    $('.opt-three-text').text(poll.opt_three)
    $('.opt-four-text').text(poll.opt_four)
    $('.andrew').text(nickname)
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

socket.on('statusMessage', (message) => {
  statusMessage.innerText = message;
});

const buttons = document.querySelectorAll('#choices button');

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast', i, avatar, nickname);
  });
}

socket.on('voteCount', (votes) => {
  votes.forEach((user, index) => {
    if(user.length !== 0){
      $(`.${user[0].nickname}`).remove()
      $(`.avatar-vote-${index+1}`).prepend(
        `<img class='vote-avatar ${user[0].nickname}' src=${user[0].avatar}/>`
      );
    }
  })
});

function postAvatar(votes) {

}
