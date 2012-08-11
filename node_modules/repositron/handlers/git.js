var spawn = require('child_process').spawn,
    path  = require('path');

exports.download = function (source, destination, callback) {
   var url = source.description.url;
   var git = spawn('git', ['clone', url, path.resolve(destination.directory)]);
   git.on('exit', function (code) {
      if (code) {
         callback && callback(new Error('git exited with code : ' + code));
      }
      else {
         callback && callback();
      }
   });
   return git;
}
