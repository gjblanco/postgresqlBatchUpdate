
var BatchInsert = function(knex, table, bufferSize){
  this.bufferSize = bufferSize || 1000;
  this.buffer = [];
  this.table = table;
  this.knex = knex;

  this.insert = function(thing) {
    this.buffer.push(thing);
    if(this.buffer.length === this.bufferSize) {
      var b = this.buffer;
      this.buffer = [];
      return this.knex.batchInsert(this.table, b, this.bufferSize);
    }
    return Promise.resolve('added to buffer');
  }
  this.flush = function() {
    return this.knex.batchInsert(this.table, this.buffer, this.bufferSize);
  }
};

module.exports = BatchInsert;