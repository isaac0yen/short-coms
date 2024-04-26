const Logger = require("../../helpers/Logger.js");
const Mail = require("../../helpers/Mail.js");
const { OneTimeID } = require("../../helpers/generateID.js");
const setJWT = require("../../helpers/SetJWT.js");
const ThrowError = require("../../helpers/ThrowError.js");
const Validate = require("../../helpers/Validate.js");
const { _MySQL } = require('../../helpers/_MySQL.js');


module.exports = {
    Query: {
  
    },
  Mutation: {
    sendCode: async (_, { email }) => {
      try {
        await _MySQL.transaction();
        await _MySQL.isolate();

        if (!Validate.email(email)) {
          ThrowError('Invalid email');
        }

        const user = await _MySQL.findOne('user', { email });

        if (!Validate.object(user)) {
          ThrowError("USER_NOT_FOUND");
        }
        let code = OneTimeID();
        const inserted = await _MySQL.insertOne('login_codes', { email, code });
        if (!Validate.integer(inserted)) {
          ThrowError("DB_ERROR");
        }

        const mailSent = await Mail.SendCode(email, user.user_name, code);

        if (!mailSent) {
          Logger.error('Mail not sent to ' + input.email, {});
        }

        return { state: true };
      } catch (error) {
        await _MySQL.rollback();
        Logger.error("An error occured in /auth/auth.js sendCode", error);
        throw error;
      }


    },
    loginUser: async (_, { email, code }) => {
      try {
        await _MySQL.transaction();
        await _MySQL.isolate();

        if (!Validate.email(email) || !Validate.integer(code)) {
          ThrowError('INVALID_INPUT');
        }

        const allUserTokens = await _MySQL.findMany('login_codes', { email });

        if (!Validate.array(allUserTokens)) {
          ThrowError('INVALID_EMAIL');
        }

        const validToken = allUserTokens[allUserTokens.length - 1];

        if (Number(code) !== Number(validToken.code)) {
          ThrowError('INCORRECT_DATA');
        }

        const user = await _MySQL.findOne('user', { email }, { columns: 'id, email' });

        await _MySQL.deleteMany('login_codes', { email });

        const token = setJWT(user.id);

        return token;

      } catch (error) {
        await _MySQL.rollback();
        Logger.error('An error occured in /auth/auth.js loginUser', error);
        throw error;
      }
    },
  }
};
