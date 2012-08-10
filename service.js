module.exports = function (app) {
   app.routers.unauthorized.get('ping', function () {
      this.res.end('pong\n');
   });
   
   app.routers.authorized.get('app/', function () {
      this.res.end('pong\n');
   });
   
   app.routers.authorized.post('apps/', function () {
      //
      // this will call app.perform application.configure
      // it will also download the application to a temporary location
      //
      var app = app.prepareApplication(req.body, function (err) {
         this.res.end('pong\n');
      });
   });
   
   app.routers.authorized.delete('apps/:id', function (id) {
      this.res.end('pong\n');
   });
   
   app.routers.authorized.put('apps/:id', function (id) {
      this.res.end('pong\n');
   });
   
   app.routers.authorized.get('drones/', function () {
      this.res.end('pong\n');
   });
   
   app.routers.authorized.post('drones/', function () {
      this.res.end('pong\n');
   });
   
   app.routers.authorized.delete('drones/:id', function (id) {
      this.res.end('pong\n');
   });
   
   app.routers.authorized.put('drones/:id', function (id) {
      this.res.end('pong\n');
   });

}