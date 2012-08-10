
before(req, res, callback)

before(req, res, callback)
haibu.perform('http:incoming', req, res, callback)

//
// You will want to set
//
req.authorization = {
   can: function (permission) { return isAllowedToDoSomethingRequiringThatPermission; }
}
//
// Will use configuration
// unauthorized:ok => boolean // allows unauthorized access to normally privileged APIs
// unauthorized:permissions => {permission:boolean} // default permission set if you do not want all when unauthorized
//
haibu.perform('http:authentication', req, res, callback)
after(req, res, callback)


before(req, res, callback)
haibu.perform('http:handler', req, res, callback)

before(spawnOptions, callback)
//
// spawnOptions = forever-monitor options
//
haibu.perform('drone:configure', spawnOptions, callback)
after(drone, callback)

before(drone, server, callback)
//
// server = {
//   type: 'tcp'
//   address: '::1'
//   port: 80
// }
//
haibu.perform('drone:server', drone, server, callback)
after(drone, server, callback)

before(drone, callback)
haibu.perform('drone:start', drone, callback)
after(drone, callback)

before(drone, callback)
haibu.perform('drone:restart', drone, callback)
after(drone, callback)

before(drone, callback)
haibu.perform('drone:stop', drone, callback)
after(drone, callback)

before(repositoryDescription, callback)
//
// {
//   type: 'git' || 'archive' || 'ftp' || 'http' || 'directory'
//   ... depends on the type
// }
//
haibu.perform('repository:fetch', repositoryDescription, callback)
after(repository, callback)

//
// this should be invoked by the repository:fetch as needed
//
before(stream, callback)
haibu.perform('repository:unpack', stream, callback)
after(stream, callback)

before(applicationDescription, callback)
//
// applicationDescription = package.json
//
haibu.perform('application:configure', applicationDescription, callback)
after(application, callback)
