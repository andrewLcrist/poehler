exports.seed = function(knex, Promise) {
  return knex('polls').del()
  .then(() => {
    return Promise.all([
      knex('polls').insert({
        name: 'Sweet ol poll',
        opt_one: 'Option 1',
        opt_two: 'Option 2',
        opt_three: 'Option 3',
        opt_four: 'Option 4',
        url: "23801"
      })
    ]);
  });
};
