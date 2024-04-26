const { _MySQL } = require('./_MySQL.js');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const Validate = require('./Validate.js');
const ThrowError = require('./ThrowError.js');
const Logger = require('./Logger.js');


const setJWT = async (id) => {
  try {
    if (!Validate.integer(id)) {
      // Invalid String Id
      ThrowError('ERROR_SET_JWT_1',);
    }

    // Find the user by ID
    let userObject;
    try {
      userObject = await _MySQL.findOne('user', { id });
      if (!userObject) {
        // User not found
        ThrowError('ERROR_SET_JWT_2');
      }
    } catch (findError) {
      // User not found
      Logger('An error occurred in SetJwt line 26', findError)
      ThrowError('ERROR_SET_JWT_2');
    }

    // Generate an access token
    let accessToken;
    try {
      accessToken = await jwt.sign({ userObject }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
    } catch (signError) {
      Logger('An error occurred in SetJwt line 36', signError)
      ThrowError('ERROR_SET_JWT_3');
    }

    // Generate a refresh token
    const refresh_id = Math.round(Math.random() * 9999999999) + '.' + Date.now();
    try {
      await _MySQL.updateOne('user', { refresh_id }, { id });
    } catch (updateError) {
      Logger('An error occurred in SetJwt line 44', updateError)
      ThrowError('ERROR_SET_JWT_4');
    }

    let refreshToken;
    try {
      const refreshObject = {
        id,
        refresh_id,
      };
      refreshToken = await jwt.sign(refreshObject, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
    } catch (signRefreshError) {
      Logger('An error occurred in SetJwt line 56', signRefreshError)
      ThrowError('ERROR_SET_JWT_5');
    }

    return { accessToken, refreshToken };
  } catch (error) {
    Logger.error('An Uncaught Error Caught', error)
    return null;
  }
};

module.exports = setJWT;