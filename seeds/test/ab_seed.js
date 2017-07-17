var BatchInserter = require('../../batchInsert');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      var batchInserter = new BatchInserter(knex, 'products');
      
      return (function iter(i) {
        if(i === 100010) {
          return batchInserter.flush();
        }
        return batchInserter.insert({
          createdAt: new Date(),
          name: 'bestProdEver' + i,
          description: 'some shita ' + i,
          price: Math.random() * 100,
          category: ['apparel', 'electronics', 'furniture'][Math.floor(Math.random() * 3)]
        }).then(iter.bind(this, i + 1));
      })(0);
    });
};
