$(document).ready( function() {
  getPolls()
})

$('.poll-submit').click(function(e) {
  e.preventDefault()
  var poll = $('.poll-input').val()
  var opt_one = $('.opt-one').val()
  var opt_two = $('.opt-two').val()
  var opt_three = $('.opt-three').val()
  var opt_four = $('.opt-four').val()
  $.ajax({
    type: "POST",
    url: '/polls',
    data: {
      poll: poll,
      opt_one: opt_one,
      opt_two: opt_two,
      opt_three: opt_three,
      opt_four: opt_four
    }
  })
  .then(function(response) {
    $('.input' ).val('');
    $('.poll-list').empty()
    getPolls()
    })
})

function getPolls() {
  $.get('/polls', function(polls){
    polls.forEach(function(poll){
      const updatedUrl = '/poll/?' + poll.id
      $('.poll-list').append(
        `<div class="poll-box">
        <p class="poll-name inline" >${poll.name}</p>
        <a href=${updatedUrl}>Poll link</a>
        </div>
        `
      )
    })
  })
}
