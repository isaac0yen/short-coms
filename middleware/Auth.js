const jwt = require('jsonwebtoken');
const ThrowError = require('../helpers/ThrowError.js');
const { _MySQL } = require('../helpers/_MySQL.js');
const setJWT = require('../helpers/SetJWT.js');
const Logger = require('../helpers/Logger.js');



function validateAccessToken(token) {
  try {
    // eslint-disable-next-line no-undef
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS256' });

  } catch (error) {/* 
    //console\.log\(JSON\.stringify\(error, null, 2\)\);
    Logger('An error occured in Auth line 15', error); */
    return null;
  }
}

function validateRefreshToken(token) {
  try {
    // eslint-disable-next-line no-undef
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, { algorithm: 'HS256' });
  } catch (error) {
    //console\.log\(JSON\.stringify\(error, null, 2\)\);
    Logger('An error occured in Auth line 25', error);
    return null;
  }
}

const Auth = async (req, res) => {
  try {
    const accessToken = req.headers['access'];
    const refreshToken = req.headers['refresh'];

    if (refreshToken && accessToken) {
      const isValidAccessToken = validateAccessToken(accessToken);

      if (isValidAccessToken) {
        return isValidAccessToken.userObject;
      }

      const isValidRefreshToken = validateRefreshToken(refreshToken);

      if (isValidRefreshToken && isValidRefreshToken.refresh_id) {

        const user = await _MySQL.findOne('user', { refresh_id: isValidRefreshToken.refresh_id });

        let userTokens

        if (user) {
          userTokens = setJWT(user.id);
        } else {
          return null;
        }

        res.set({
          'Access-Control-Expose-Headers': 'access,refresh',
          'access': userTokens.accessToken,
          'refresh': userTokens.refreshToken
        });

        return user.userObject

      } else {
        ThrowError('RELOGIN')
      }

    } else {
      return null;
    }
  } catch (err) {
    Logger('An error occured in Auth line 74 for user with id:', error);
  }
}

module.exports = Auth;