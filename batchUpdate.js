
var BatchUpdate = function(knex, table, bufferSize){

  this.bufferSize = bufferSize || 1000;
  this.buffer = [];
  this.table = table;
  this.knex = knex;

  this.update = function(key, thing) {
    this.buffer.push(
      this.knex(this.table).update(thing).where(key).toString()
    );
    
    if(this.buffer.length === this.bufferSize) {
      var b = this.buffer;
      this.buffer = [];
      // console.log(
      //   b.join(';') + ';'
      // );
      return this.knex.raw(b.join(';') + ';')//.catch(console.log)
    }
    return Promise.resolve('added to buffer');
  }
  this.flush = function() {
    if(this.buffer.length === 0)
      return Promise.resolve('nothing to flush');
    //console.log(this.buffer.join(';') + ';');
    return this.knex.raw(this.buffer.join(';') + ';')
      .then(()=>'last update success!!')
      .catch(console.log);
  }
};

function toQueryString(things, fieldsToUpdate) {

}

module.exports = BatchUpdate;