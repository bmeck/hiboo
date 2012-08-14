var path = require('path');
var Repository = require('repositron').Repository;
var Monitor = require('forever-monitor').Monitor;
module.exports = Application;
function Application(description, manager) {
   var application = this;
   application.manager = manager;
   //
   // Copy stuff around
   //
   
   //.name
   var applicationDirectory = path.join(application.manager.config.get('directories:applications'), description.name);
   application.meta = {
      description: description,
      spawnOptions: {
         options: description.scripts && description.scripts.start ? [description.scripts.start] : [],
         spawnWith: {
            cwd: applicationDirectory
         },
         sourceDir: applicationDirectory,
         fork: true
      },
      repository: description.repository || {}
   };
   application.monitors = [];
   //.repository
   var destination = application.meta.repository.destination = application.meta.repository.destination || {};
   destination.directory = applicationDirectory;
   
   //
   // References this application using closure
   // this in these references the .drones of an app
   //
   application.drones = {
      //
      // get a drone by id
      //
      get: function (id, callback) {
         var drones = id ? applicaiton.monitors.filter(function (monitor) {
            return monitor.uid === id;
         }) : application.monitors;
         if (drones) {
            callback && callback(null, drones);
         }
         else {
            callback && callback(new Error('No Drone found for that id'))
         }
      },
      //
      // kills drones
      //
      // id? : uid to search for, null to kill all
      //
      kill: function (id, callback) {
         this.get(id, function (err, drones) {
            if (err) {
               callback && callback(err);
               return;
            }
            drones.forEach(function (monitor) {
               monitor.stop();
            });
            callback && callback(null, drones);
         });
      },
      //
      // spawns up a new drone
      //
      add: function (callback) {
         application.manager.perform('application.drone.spawn', application, function (application) {
            //
            // Get ready to start up the drone
            // Allows for simple event handlers to be added
            //
            console.error(application.meta.spawnOptions);
            var monitor = new Monitor(null, application.meta.spawnOptions);
            application.manager.perform('application.drone.start', application, monitor, function (application, monitor) {
               monitor.start();
               application.monitors = application.monitors || [];
               application.monitors.push(monitor);
               callback && callback(null, application);
            });
         });
         return;
      }
   }
   console.error(this.meta.description, this.name, application.name)
   application.manager._applications[application.name] = application;
   return application;
}
Object.defineProperty(Application.prototype, 'name', {
   get: function () {
     return this.meta.description.name;
   }
});
Application.prototype.configure = function (callback) {
   var application = this;
   //
   // Let us manipulate the application description before we download it
   //
   application.manager.perform('application.repository.configure', null, application, function (err, application) {
      if (err) {
         callback && callback(err, null);
         return;
      }
      //
      // Download the app and install it
      //
      application.repository = new Repository(application.meta.repository);
      application.repository.download(function (err) {
         if (err) {
            callback && callback(err, null);
            return;
         }
         //
         // Last minute configuration after the application has been downloaded
         //
         application.manager.perform('application.configure', null, application, function (err, application) {
            if (err) {
               callback && callback(err, null);
               return;
            }
            callback && callback(null, application); 
         });
      })
   });
}
Application.prototype.destroy = function () {
   var application = this;
   application.drones.kill(null, function (err, drones) {
      if (err) {
         callback && callback(err, null);
         return;
      }
      delete application.manager._applications[application.name];
      callback && callback(null, application);
   });
}
Application.prototype.toJSON = function () {
   return this.meta.description;
}