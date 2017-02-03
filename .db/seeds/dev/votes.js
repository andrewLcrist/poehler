exports.seed = function(knex, Promise) {
  return knex('polls').del()
  .then(() => {
    return Promise.all([
      knex('polls').insert({
        votes: 'Sweet ol poll',
        poll_id: '23801'
      })
    ]);
  });
};
