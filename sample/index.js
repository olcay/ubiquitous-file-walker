var jaunt = require('../index');

var dir = process.argv[2];

if(dir){
  jaunt(dir, function(err, data){
    if(err == null){
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log("Error: %j", err);
    }
  });
} else {
  console.log("Usage: node index.js <dir>");
}
