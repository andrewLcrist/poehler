
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('polls', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('opt_one');
      table.string('opt_two');
      table.string('opt_three');
      table.string('opt_four');
      table.string('poll_id');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('polls')
  ])
};
