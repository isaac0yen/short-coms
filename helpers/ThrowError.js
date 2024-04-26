const { GraphQLError } = require('graphql');

// eslint-disable-next-line no-unused-vars
const ThrowError = (message, code = '') => {
    throw new GraphQLError(message, {
        extensions: { code: 'USER' },
    });
};

module.exports = ThrowError;
