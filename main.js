var config = require('./knexfile.js')['test'];
var knex = require('knex')(config);

var BatchUpdater = require('./batchUpdate');

var batchUpdater = new BatchUpdater(knex, 'products');

var keyThing = [];

for(var i = 0; i < 100000; i++) {
  keyThing.push([{id: i + 1}, {description: 'description ' + i}]);
}


(function iter(i) {
  const j = i;
  //console.log('i', j)
  if(i === keyThing.length) {
    //console.log('success!!');
    return batchUpdater.flush()//.then(console.log.bind(console, 'flushing'))
    .then(function(){knex.destroy()})
  }
  else return batchUpdater.update(keyThing[i][0], keyThing[i][1])
    .then(function(m){
      //console.log(m)
      iter(i + 1)
    });
})(0)
  //.then(console.log.bind(this, 'oh brother'))
  //.catch(console.log)



