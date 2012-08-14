//
// Simple means for a manager to get information from drone IPC
//
exports.attach = function () {
   var app = this;
   app.before('application.drone.start', function (application, monitor) {
      monitor.on('message', function (message) {
         var webhook = app.config.get('ipc:webhook');
         //
         // Pass it on
         //
         if (webhook) {
            request({
               url: webhook,
               json: {
                  application: application.name,
                  drone: monitor.uid,
                  message: message
               }
            }, function (err, res, body) {
               if (err) {
                  app.log.error(err.message);
               }
               else if (res.statusCode !== 200) {
                  app.log.error(body);
               }
            });
         }
      });
   });
}