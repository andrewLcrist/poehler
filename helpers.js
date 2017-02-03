const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

module.exports = {

  postNewPoll: function(poll, opt_one, opt_two, opt_three, opt_four, poll_id, response) {
    database('polls').insert({name: poll, opt_one: opt_one, opt_two: opt_two, opt_three: opt_three, opt_four: opt_four, poll_id: poll_id })
    .then(function() {
      database('polls').select()
        .then(function(polls) {
          response.status(200).json(polls)
        })
        .catch(function(error) {
          console.error('Sorry, unable to save new poll.')
        });
    })
  },

  getPolls: function(response) {
    database('polls').select()
      .then(function(polls){
        response.status(200).json(polls)
      })
      .catch(function(error) {
        console.log('Sorry, unable to retrieve polls')
      })
  },

  getPollById: function(id, response) {
    database('polls').select().table('polls').where('id', id)
      .then(function(poll) {
        response.status(200).json(poll);
      })
      .catch(function(error) {
        console.error(error)
      })
  }
}
