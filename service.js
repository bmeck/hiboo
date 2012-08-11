module.exports = function (app) {
   app.routers.unauthorized.get('ping', function () {
      this.res.end('pong\n');
   });
   
   app.routers.authorized.get('apps/', function () {
      var res = this.res;
      app.applications.all(function (err, applications) {
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
   
   app.routers.authorized.post('apps/', {stream: true}, function () {
      //
      // this will call app.perform application.configure
      // it will also download the application to a temporary location
      //
      var req = this.req;
      var res = this.res;
      var body = '';
      req.on('data', function (data) {
         body += data;
      });
      req.on('end', function () {
         app.applications.add(JSON.parse(body), function (err, application) {
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
   
   app.routers.authorized.get('apps/:id/drones/', function () {
      app.drones.add();
      this.res.end('pong\n');
   });
   
   app.routers.authorized.post('apps/:id/drones/', function () {
      app.drones.all();
      this.res.end('pong\n');
   });
   
   app.routers.authorized.delete('apps/:id/drones/:id', function (id) {
      app.drones.destroy(id);
      this.res.end('pong\n');
   });
}