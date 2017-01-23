var fs = require('fs'),
    path = require('path');

/**
 * Retrieve the contents(filenames/dirnames) of a given target path and all its subdirectories.
 *
 * @param  {String}   dir
 * @param  {function} callback The callback is passed two arguments (err, data), where data is the contents.
 */
var jaunt = function (dir, callback) {
  var data = {
    filenames: [],
    dirnames: []
  };

  //First check if the given parameter is a directory or not
  fs.stat(dir, function (err, stats) {
    if (err) return callback(err);
    if (stats && stats.isDirectory()) {

      //Add it to directory name list
      data.dirnames.push(dir);

      //Does it contain anything inside
      fs.readdir(dir, function (err, files) {
        if (err) return callback(err);
        var imminent = files.length;
        if (!imminent) return callback(null, data);
        files.forEach(function (file) {
          file = path.resolve(dir, file);

          //If it has something look for it again
          jaunt(file, function (err, result) {
            if (err) return callback(err);
            data.filenames = data.filenames.concat(result.filenames);
            data.dirnames = data.dirnames.concat(result.dirnames);
            if (!--imminent) { callback(null, data); }
          });
        });
      });
    } else {
      
      //It is a file or we can't get its stats
      data.filenames.push(dir);
      callback(null, data);
    }
  });
};

module.exports = jaunt;
