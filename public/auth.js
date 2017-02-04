$(document).ready(function() {
  $.get('/authkeys')
  .then(secrets => {
    doAuth(secrets)
  })
})

  const doAuth = (secrets) => {
    let lock = new Auth0Lock(secrets.authId, secrets.authDomain, {
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
    let retrieve_profile = function() {
      let id_token = localStorage.getItem('id_token');
      if (id_token) {
        lock.getProfile(id_token, function (err, profile) {
          if (err) {
            return alert('There was an error getting the profile: ' + err.message);
          }
          // Display user information
          localStorage.setItem('profile', JSON.stringify(profile))
          show_profile_info(profile);
        });
      }
    };

    let logout = function() {
      localStorage.removeItem('id_token');
      window.location.href = "https://www.youtube.com/watch?v=PwjY6s7yfSk&t=38s";
    };

    retrieve_profile();
  }

let show_profile_info = function(profile) {
   $('.nickname').text(profile.nickname);
   $('.btn-login').hide();
   $('.avatar-main').attr('src', profile.picture).show();
   $('.btn-logout').show();
};
