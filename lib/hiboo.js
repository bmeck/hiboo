//
// Usage:
//   node haibu.js --plugins .../sso.js --http true --plugins .../spawning-config.js
//

var fs = require('fs');
var path = require('path');
var flatiron = require('flatiron');
var Understudy = require('understudy').Understudy;

var app = Understudy.call(flatiron.app);
app.config.argv().file('config.json').env().defaults({
   plugins: [ './servers', './http-service', './http-app' ],
   directories: {
      applications: __dirname + '/../local/apps'
   }
});
//
// Monitor and Repository support
//
app.use(require('./hiboo/application/plugin'));
app.use(require('./hiboo/plugin/pluggable'));
require('./hiboo/routes')(app, app.config.get('routes'));
app.init();
