var Monitor = require('forever-monitor').Monitor;
module.exports = DroneFactory;

function DroneFactory(haibu) {
   return function Drone(app) {
      var self = this;
      self.app = app || haibu.config.get('drone:defaults:app');
      haibu.perform('drone.configure', self, haibu.config.get('drone:defaults:spawnOptions'), function startDrone(self, spawnOptions) {
         var monitor = self.monitor = new Monitor(app.scripts.start, spawnOptions);
         //
         // Connect pluggable endpoints
         //
         monitor.on('message', app.perform.bind(app, 'drone.message', self));
         monitor.on('restart', app.perform.bind(app, 'drone.restart', self));
         monitor.on('exit', app.perform.bind(app, 'drone.exit', self));
         monitor.start();
      });
   }
}