var Monitor = require('forever-monitor').Monitor;

exports.name = 'application-drones';
exports.attach = function (options) {
   var app = this;
   
   var drones  = {};
   var droneUid = 0;
   
   app.drones = {
      all: function allDrones(applicationId, callback) {
         callback(null, applicationId && drones[applicationId] || drones);
      },
      add: function addDrone(applicationId, callback) {
         app.applications.get(applicationId, function (err, application) {
            if (err) {
               callback(err);
               return;
            }
            new Drone(application, function (err, drone) {
               if (err) {
                  callback(err);
                  return;
               }
               var applicationDrones = drones[applicationId] || (drones[applicationId] = {});
               applicationDrones[drone.id] = drone;
               callback(null, drone);
            });
         });
      },
      get: function (applicationId, droneId, callback) {
         var applicationDrones = drones[applicationId];
         if (!applicationDrones) {
            callback(new Error('Application not found'), null);
            return;
         }
         var drone = applicationDrones[droneId];
         if (!drone) {
            callback(new Error('Drone not found'), null);
         }
         else {
            callback(null, drone);
         }
      },
      destroy: function (applicationId, droneId, callback) {
         var monitor = drone.monitor;
         monitor.on('exit', function () {
            var applicationDrones = drones[applicationId];
            delete applicationDrones[droneId];
            if (Object.keys(applicationDrones).length === 0) {
               delete applicationDrones[applicationId];
            }
            callback(null);
         });
         monitor.kill();
      }
   };
   function Drone(application, callback) {
      var self = this;
      function startDrone(self, spawnOptions) {
         var monitor = self.monitor = new Monitor(self.application.scripts.start, spawnOptions);
         if (self.id == null) {
            self.id = droneUid++;
         }
         //
         // Connect pluggable endpoints
         //
         monitor.on('start', callback.bind(self, null, self));
         monitor.on('message', app.perform.bind(app, 'drone.message', self));
         monitor.on('restart', app.perform.bind(app, 'drone.restart', self));
         monitor.on('exit', app.perform.bind(app, 'drone.exit', self));
         monitor.start();
      }
      self.application = application || haibu.config.get('drone:defaults:application');
      haibu.perform('drone.configure', self, {}, startDrone);
      return self;
   }
}