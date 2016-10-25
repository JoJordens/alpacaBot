const Hapi =      require('hapi'),
      mongoose =  require('mongoose'),
      server = new Hapi.Server()

server.connection({port: 8080})

// var defaultKey = 'key1'// TODO store key on db
// var projectKey = 'key2'// TODO store key on db
// var passwordRecoveryKey = 'key3'// TODO store key on db
// var validate = require('jwtauth')

// server.register(require('hapi-auth-jwt'), function (error) {
//     server.auth.strategy('tokenDefault', 'jwt', {
//         key: defaultKey,
//         validateFunc: validate
//     })
//     server.auth.strategy('tokenProject', 'jwt', {
//         key: projectKey,
//         validateFunc: validate
//     })
//     server.auth.strategy('tokenPasswordRecovery', 'jwt', {
//         key: passwordRecoveryKey,
//         validateFunc: validate
//     })
// })

const routes = require('./routes.es6').routes
server.route(routes)

mongoose.connect('mongodb://normal:normal@'+"macosafe_mongo_1"+':'+27017+'/test')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function (callback) {
    server.start(function () {
        console.log('Project server running at: ', server.info.uri)
        job.start()
    })
})
