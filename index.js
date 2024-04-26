const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const typeDefs = require('./typedefs.js');
const resolvers = require('./resolvers/index.js');
const { mySQLConnect } = require('./helpers/_MySQL.js');
const Auth = require('./middleware/Auth.js');
require('dotenv/config');
const Logger = require('./helpers/Logger.js');
require('./config.js');


mySQLConnect().then(async (data) => {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  startStandaloneServer(server, {
    listen: { port: process.env.PORT },
    context: async ({ req, res }) => {
      let config = await Auth(req, res);
      return config;
    },
  }).then(({ url }) => {
    console.log(`🚀  Server server for ${_CONFIG.APP_NAME} ready at: ${url}`);
  }).catch(err => {
    Logger.error('An error occurred while creating server: ', err);
    throw err;
  });

});