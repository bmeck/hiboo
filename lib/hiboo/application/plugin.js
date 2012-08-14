//
// Plugin to add Monitor management to an App
// Authomatically starts child process on creation
//
// Probes:
//   application.repository.configure(application) => allows for configuration of .description.repository
//   application.configure(application) => allows configuration of values in .description after repository is downloaded
//   application.drone.spawn(application) => prepare to spawn an application drone
//   application.drone.start(application, monitor) => starts the child process
//
// (c) 2012 Nodejitsu Inc.
//
var Monitor = require('forever-monitor').Monitor;
var Application = require('./application');
exports.name = 'application';
exports.attach = function (options) {
   //
   // You should only mess with meta.* usually unless adding events
   // { description: { meta: package.json, spawnOptions: Monitor.arguments[1], repository: Repository.arguments[0] }, monitors: [ Monitor ], repository: Repository }
   //
   var app = this;
   app._applications = {};
   app.applications = {
      all: function allApplications(callback) {
         callback(null, app._applications);
      },
      add: function addApplication(description, callback) {
         if (description.name) {
            var applicaiton = app._applications[description.name];
            if (application) {
               callback && callback(new Error('Application already exists'), null);
               return;
            }
         }
         var application = new Application(description, app);
         application.configure(function (err, application) {
            if (err) {
               callback && callback(err, application);
               return;
            }
            callback && callback(null, application);
         });
      },
      get: function getApplication(name, callback) {
         console.error(app._applications)
         var application = app._applications[name];
         if (application) {
            callback && callback(null, application);
            return;
         }
         callback && callback(new Error('Application not found'), null);
      },
      destroy: function destroyApplication(name, callback) {
         this.get(name, function (err, application) {
            if (err) {
               callback && callback(err, null);
               return;
            }
            application.destroy(callback);
         });
      }
   };
}