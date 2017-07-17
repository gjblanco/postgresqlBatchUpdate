
exports.up = function(knex, Promise) {
  return knex.schema.createTable('products', function(t) {
        t.increments('id').unsigned().primary();
        t.dateTime('createdAt').notNull();

        t.string('name').notNull();
        t.text('description').nullable();
        t.decimal('price', 6, 2).notNull();
        t.enum('category', ['apparel', 'electronics', 'furniture']).notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('products');
};
