var director = require('director');
var service = require('./service');

exports.name = 'http-service';

exports.attach = function () {
   var app = this;
   app.use(require('./servers.js'));
   //
   // 1. http.incoming (reject connections / log from here) ->
   // 2. http.authorization (set req.authorization) ->
   // 2.1 http.authorized (do things)
   // 2.1 http.unauthorized (do things)
   //
   app.routers = {
      authorized: new director.http.Router(),
      unauthorized: new director.http.Router()
   };
   
   service(app);
}

exports.init = function () {
   function workflow(req, res) {
      app.perform('http.incoming', req, res, function getAuthorization(req, res, cleanup) {
         app.perform('http.authorization', req, res, function routeAuthorization(req, res, cleanup) {
            if (req.authorization) {
               app.perform('http.authorized', req, res, function handleAuthorized(req, res, cleanup) {
                  var method = req.method;
                  var url = req.url;
                  if (app.routers.authorized.dispatch(req, res) || app.routers.unauthorized.dispatch(req, res)) return;
                  res.writeHead(404);
                  res.end();
               });
            }
            else {
               app.perform('http.unauthorized', req, res, function handleUnauthorized(req, res, cleanup) {
                  if (app.routers.unauthorized.dispatch(req, res)) return;
                  res.writeHead(403);
                  res.end();
               });
            }
         });
      });
   }
   
   var app = this;
   if (app.config.get('http')) {
      app.servers.http.on('request', workflow);
      app.servers.http.listen(app.config.get('http:port') || 80, app.config.get('http:address'));
   }
   if (app.config.get('http')) {
      app.servers.http.on('request', workflow);
      app.servers.http.listen(app.config.get('https:port') || 443, app.config.get('https:address'));
   }
}
