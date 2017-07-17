
var BatchUpdate = function(knex, table, fieldsToUpdate, fieldsKey, bufferSize){
  //fields to update: ['field1', 'field2', ...]
  //fields key: ['partial_key1', 'partial_key2', ...]


  ///https://stackoverflow.com/questions/18797608/update-multiple-rows-in-same-query-using-postgresql
  this.queryStart = 'update ' + table
      + ' as t set ';
  for(var i = 0; i < fieldsToUpdate.length; i++) {
    this.queryStart += fieldsToUpdate[i] + 'c.' + fieldsToUpdate[i];
    if(i < fieldsToUpdate.length - 1) 
      this.queryStart += ',';
  }
  this.queryStart += ' from (values';

  this.queryMiddle = [];  

  this.queryEnding = ') as c(';
  for(var i = 0; i < fieldsKey.length; i++) {
    this.queryEnding += fieldsKey[i] + ', ';
  }
  for(var i = 0; i < fieldsToUpdate.length; i++) {
    this.queryEnding += fieldsToUpdate[i];
    if(i < fieldsToUpdate.length - 1) 
      this.queryEnding += ', ';
  }

  this.queryEnding += ') where ';
  for(var i = 0; i < fieldsKey.length; i++) {
    this.queryEnding += 'c.' + fieldsKey[i] + ' = t.' + fieldsKey[i];
    if(i < fieldsKey.length - 1) {
      this.queryEnding += ' and ';
    }
  }

  this.fieldsToUpdate = fieldsToUpdate;
  this.fieldsKey = fieldsKey;


  this.bufferSize = bufferSize || 1000;
  this.buffer = [];
  this.table = table;
  this.knex = knex;

  this.update = function(key, thing) {
    this.buffer.push(
      (this.buffer.length === 0? '(': ',(')
      + this.fieldsKey.map(f => key[f]).join(',')
      + ','
      + this.fieldsToUpdate.map(f => thing[f]).join(',')
      + ')'
    );
    
    if(this.buffer.length === this.bufferSize) {
      var b = this.buffer;
      this.buffer = [];
      console.log(
        this.queryStart + this.buffer.join('') + this.queryEnding
      );
      // return this.knex.batchInsert(this.table, b, this.bufferSize)
      //   .then(function(){
      //     console.log(this.knex
      //       .batchInsert(this.table, b, this.bufferSize)
      //       .toString())
      
      //   });
      return Promise.resolve('queried')
    }
    return Promise.resolve('added to buffer');
  }
  this.flush = function() {
    //return this.knex.batchInsert(this.table, this.buffer, this.bufferSize);
  }
};

function toQueryString(things, fieldsToUpdate) {

}

module.exports = BatchUpdate;