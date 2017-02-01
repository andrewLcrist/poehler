exports.seed = function(knex, Promise) {
  return knex('polls').del()
  .then(() => {
    return Promise.all([
      knex('polls').insert({
        name: 'Cool Sites',
      })
    ]);
  });
};
