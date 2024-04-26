const { _MySQL, mySQLConnect } = require("../../helpers/_MySQL")
const Validate = require("../../helpers/Validate")

const ThrowError = require("../../helpers/ThrowError")
const Logger = require("../../helpers/Logger");
const setJWT = require("../../helpers/SetJWT");

require('../../config.js');

module.exports = {
  Query: {
    getUser: async (_, { id }) => {
      try {
        if (!Validate.integer(id)) {
          ThrowError("INVALID_ID");
        }
        const user = await _MySQL.findOne("user", { id });
        if (!user) {
          ThrowError("USER_NOT_FOUND");
        }
        return user;
      } catch (error) {
        Logger.error("An error occurred in getUser", error);
        throw error;
      }
    },
    getAllUsers: async (_, { page }) => {
      try {
        if (!Validate.integer(LIMIT)) {
          ThrowError("INVALID_LIMIT");
        }
        if (!Validate.integer(page)) {
          ThrowError("INVALID_PAGE");
        }
        const users = await _MySQL.executeDirect(
          `SELECT * FROM user LIMIT ? OFFSET ?;`,
          [LIMIT, (page - 1) * LIMIT]
        );
        if (!Validate.array(users)) {
          ThrowError("USER_LIST_NOT_FOUND");
        }
        return users;
      }
      catch (error) {
        Logger.error("An error occurred in getAllUsers", error);
        throw error;
      }
    }

  },
  Mutation: {
    registerUser: async (_, { user }) => {
      try {
        await _MySQL.transaction();
        await _MySQL.isolate();


        const { email, first_name, last_name, user_name, security_question, security_answer } = user;

        if (!Validate.email(email)) {
          ThrowError('INVALID_EMAIL');
        }
        if (!Validate.string(first_name)) {
          ThrowError('INVALID_FIRST_NAME',);
        }

        if (!Validate.string(last_name)) {
          ThrowError('INVALID_LAST_NAME',);
        }
        if (!Validate.string(user_name)) {
          ThrowError('INVALID_USER_NAME',);
        }
        if (!Validate.string(security_question)) {
          ThrowError('INVALID_SECURITY_QUESTION',);
        }
        if (!Validate.string(security_answer)) {
          ThrowError('INVALID_SECURITY_ANSWER',);
        }

        const inserted = _MySQL.insertOne('user', {
          email,
          first_name,
          last_name,
          user_name,
          security_question,
          security_answer,
          state: "ACTIVE"
        });

        if (!Validate.integer(inserted)) {
          ThrowError('DB_ERROR');
        }

        const token = setJWT(inserted)

        if (!Validate.object(token)) {
          ThrowError('JWT_ERROR');
        }

        return { ...token, state: true };

      } catch (error) {
        await _MySQL.rollback();
        Logger.error("An error occured in user/user.js registerUser", error);
        throw error;
      }
    },
    updateUser: async (_, { user, id }) => {
      try {
        await _MySQL.transaction();
        await _MySQL.isolate();

        if (!Validate.integer(id)) {
          ThrowError('INVALID_USER_ID');
        }

        for (const key in user) {
          if (!Validate.string(user[key])) {
            ThrowError('INVALID_INPUT', key);
          }
        }

        const updated = _MySQL.updateOne('user', { ...user }, { id });

        if (!Validate.integer(updated)) {
          ThrowError('DB_ERROR');
        }

        return { state: true };

      } catch (error) {
        await _MySQL.rollback();
        Logger.error("An error occured in user/user.js updateUser", error);
        throw error;
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        await _MySQL.transaction();
        await _MySQL.isolate();

        if (!Validate.integer(id)) {
          ThrowError('INVALID_USER_ID');
        }

        const deleted = await _MySQL.updateOne('user', { state: "DELETED" }, { id });

        if (!Validate.integer(deleted)) {
          ThrowError('DB_ERROR');
        }

        return { state: true };

      } catch (error) {
        await _MySQL.rollback();
        Logger.error("An error occured in user/user.js deleteUser", error);
        throw error;
      }
    }
  }
}