const user = require('./user/user');
const session = require('./session/session');
const Auth = require('./auth/auth');

const resolvers = {
  Query: {
    ...user.Query,
    ...session.Query,
    ...Auth.Query
  },
  Mutation: {
    ...user.Mutation,
    ...session.Mutation,
    ...Auth.Mutation
  }
};

module.exports = resolvers;