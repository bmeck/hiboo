//
// Usage:
//   node haibu.js --plugins .../sso.js --http true --plugins .../spawning-config.js
//

var fs = require('fs');
var path = require('path');
var flatiron = require('flatiron');
var Understudy = require('understudy').Understudy;

var app = Understudy.call(flatiron.app);
app.config.argv().file('config.json').env();
app.use(require('./pluggable'));
app.init();
