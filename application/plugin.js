var Repository = require('repositron').Repository;
var path = require('path');
var rimraf = require('flatiron').common.rimraf;

exports.name = 'applications';
exports.attach = function () {
   var app = this;
   
   var applications = {};
   var applicationUid = 0;
   
   app.applications = {
      add: function add(applicationDescription, callback) {
         new Application(applicationDescription, function (err, application) {
            if (err) {
               callback(err);
               return;
            }
            applications[application.id] = application;
            callback(null, application);
         });
      },
      all: function all(callback) {
         callback(null, applications);
      },
      destroy: function destroy(applicationId, callback) {
         app.applications.get(applicationId, function (err, application) {
            if (err) {
               callback(err);
               return;
            }
            rimraf(application.destination.directory, function (err) {
               if (err) {
                  callback(err);
                  return;
               }
               delete applications[applicationId];
               callback(null);
            });
         });
      },
      get: function get(applicationId, callback) {
         var application = applications[applicationId];
         if (!application) {
            callback(new Error("Application not found"), null);
         }
         callback(null, application);
      }
   };
   
   function Application(description, callback) {
      var self = this;
      function fetchApplication(self) {
         var repository = self.repository = new Repository(self.description.repository);
         if (self.id == null) {
            self.id = applicationUid++;
         }
         if (self.destination.directory == null) {
            self.destination.directory = path.join(app.config.get('directories:apps'), self.id);
         }
         repository.download(self.destination, function (err) {
            if (err) {
               callback(err);
               return;
            }
            callback(null, self);
         });
      }
      self.id = description.id;
      self.description = description;
      self.destination = {};
      app.perform('application.configure', self, fetchApplication);
      return self;
   }
}