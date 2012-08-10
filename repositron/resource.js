function Repository(description) {
   this.description = description;
   return this;
}
Repository.handlers = {};

//
// This does not use streams due to complexities in fetching some things such as git+ssh
//
Repository.prototype.download = function downloadRepository(destination, callback) {
   return Repository.handlers[this.description.type].download(this, destination, callback);
}

Repository.handlers.tar = require('./handlers/tar');
Repository.handlers.git = require('./handlers/git');

//
// new Repository({
//    type: 'git',
//    url: 'git@github.com:bmeck/ruffian'
// }).download({directory:'wtf'}, function (err) {
//    console.error(err)
// });
//
