var path = require('path');
var Repository = require('repositron').Repository;
var Monitor = require('forever-monitor').Monitor;
var Understudy = require('understudy').Understudy;
module.exports = Application;
function Application(meta, manager) {
   Understudy.call(this);
   var application = this;
   //
   // Copy stuff around
   //
   
   application.meta = meta;
   meta.spawnOptions = meta.spawnOptions || {};
   meta.spawnOptions.spawnWith = meta.spawnOptions.spawnWith || {};
   application.monitors = [];
   //.repository
   application.meta.repository = application.meta.repository || {};
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
         application.perform('drone.spawn', application, function (application) {
            //
            // Get ready to start up the drone
            // Allows for simple event handlers to be added
            //
            var monitor = new Monitor(null, application.meta.spawnOptions);
            application.perform('drone.start', application, monitor, function (application, monitor) {
               monitor.start();
               application.monitors = application.monitors || [];
               application.monitors.push(monitor);
               callback && callback(null, application);
            });
         });
         return;
      }
   }
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
   application.perform('repository.configure', null, application, function (err, application) {
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
         application.perform('configure', null, application, function (err, application) {
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
      callback && callback(null, application);
   });
}
Application.prototype.toJSON = function () {
   var application = this;
   var monitorUids = application.monitors.map(function (monitor) {
      return monitor.uid;
   });
   return {
      meta: application.meta,
      monitors: monitorUids
   };
}