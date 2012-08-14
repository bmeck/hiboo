module.exports = function (app) {
   //
   // Way to check if the app is alive
   //
   app.routers.unauthorized.get('ping', function () {
      this.res.end('pong\n');
   });
   
   //
   // List all of the applications
   //
   app.routers.authorized.get('apps/', function () {
      var res = this.res;
      app.applications.all(function (err, applications) {
         console.error(arguments)
         var statusCode = 200;
         if (err) {
            statusCode = err.code || 500;
         }
         res.writeHead(statusCode, {
            "content-type": 'application/json'
         });
         res.end(JSON.stringify(err || applications));
      });
      this.res.end('pong\n');
   });
   
   //
   // Create a new application from the description
   //
   app.routers.authorized.post('apps/', {stream: true}, function () {
      //
      // this will call app.perform application.configure
      // it will also download the application to a temporary location
      //
      //
      // for example
      //
      // {
      //   "description" : {
      //     "name": "http-app",
      //     "scripts": {"start": "server.js"},
      //   },
      //   "repository": {"type": "folder", "directory": "example/http-app"}}
      // }
      //
      var req = this.req;
      var res = this.res;
      var body = '';
      req.on('data', function (data) {
         body += data;
      });
      req.on('end', function () {
         try {
            var applicationDescription = JSON.parse(body);
         }
         catch (e) {
            res.writeHead(400, {
               "content-type": 'application/json'
            });
            res.end(JSON.stringify(e.message));
         }
         app.applications.add(applicationDescription, function (err, application) {
            var statusCode = 200;
            if (err) {
               statusCode = err.code || 500;
            }
            res.writeHead(statusCode, {
               "content-type": 'application/json'
            });
            res.end(JSON.stringify(err && err.message || application));
         });
      });
   });
   
   app.routers.authorized.delete('apps/:id', function (id) {
      app.applications.destroy(id);
      this.res.end('pong\n');
   });
   
   app.routers.authorized.put('apps/:id', function (id) {
      app.applications.update(id, req.body);
      this.res.end('pong\n');
   });
   
   app.routers.authorized.get('apps/:id/drones/', function (applicationId) {
      app.drones.all(applicationId);
      this.res.end('pong\n');
   });
   
   app.routers.authorized.post('apps/:id/drones/', function (applicationId) {
      var res = this.res;
      app.applications.get(applicationId, function (err, application) {
         if (err) {
            res.writeHead(400, {
               "content-type": 'application/json'
            });
            res.end(err.message);
            return;
         }
         application.drones.add(function (err, drone) {
            var statusCode = 200;
            if (err) {
               statusCode = err.code || 500;
            }
            res.writeHead(statusCode, {
               "content-type": 'application/json'
            });
            res.end(JSON.stringify(err && err.message || drone));
         });
      });
   });
   
   app.routers.authorized.delete('apps/:id/drones/:id', function (id) {
      app.drones.destroy(id);
      this.res.end('pong\n');
   });
}