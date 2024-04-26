const ThrowError = require("../../helpers/ThrowError");
const Validate = require("../../helpers/Validate");

const { _MySQL } = require("../../helpers/_MySQL");

require('../../config.js');

module.exports = {
  Query: {
    getSession: async (_, { id }, context) => {
      try {
        if (!Validate.integer(id)) {
          ThrowError("INVALID_SESSION_ID");
        }
        const session = await _MySQL.findOne("session", { id });

        if (!Validate.object(session)) {
          ThrowError("SESSION_NOT_FOUND");
        }

        const session_members = await _MySQL.findMany("user_session", { session_id: id });
        if (!Validate.array(session_members)) {
          ThrowError("USER_LIST_NOT_FOUND");
        }

        const created_by = () => {
          for (const key in session_members) {
            if (session_members[key].user_id === session.created_by) {
              return session_members[key];
            }
          }
        }

        const object = {
          ...session,
          members: session_members,
          created_by: created_by()
        }

        return object;
      } catch (error) {
        Logger.error("An error occured in getSession", error);
        throw error;
      }
    },
    getAllSessions: async (_, { page }, context) => {
      try {
        if (!Validate.integer(page)) {
          ThrowError("INVALID_PAGE");
        }
        if (!Validate.integer(LIMIT)) {
          ThrowError("INVALID_LIMIT");
        }
        const sessions = await _MySQL.executeDirect(
          `SELECT * FROM session LIMIT ? OFFSET ?;`,
          [LIMIT, (page - 1) * LIMIT]
        );
        if (!Validate.array(sessions)) {
          ThrowError("SESSION_LIST_NOT_FOUND");
        }
        return sessions;

      } catch (error) {
        Logger.error("An error occured in getAllSessions", error);
        throw error;

      }
    }
  },
  Mutation: {
    createSession: async (_, { session }, context) => {
      try {
        await _MySQL.transaction();
        await _MySQL.isolate();

        if (!Validate.integer(context.id)) {
          ThrowError("AUTH_ERROR");
        }
        if (!Validate.string(session.session_name)) {
          ThrowError("INVALID_SESSION_NAME");
        }
        if (!Validate.string(session.description)) {
          ThrowError("INVALID_DESCRIPTION");
        }

        const date = DateTime.local().setZone('Africa/Lagos').toLocaleString(DateTime.DATETIME_FULL);

        const inserted = await context.db.insertOne("session", {
          session_name: session.session_name,
          description: session.description,
          created_by: context.id,
          created_at: date
        });

        if (!Validate.integer(inserted)) {
          ThrowError("DB_ERROR");
        }

        return { state: true };
      } catch (error) {
        await _MySQL.rollback();
        Logger.error("An error occurred in session/session.js createSession", error);
        throw error;
      }
    },
    updateSession: async (_, { session, id }, context) => {
      try {
        await _MySQL.transaction();
        await _MySQL.isolate();

        if (!Validate.integer(context.id)) {
          ThrowError("AUTH_ERROR");
        }
        if (!Validate.integer(id)) {
          ThrowError("INVALID_SESSION_ID");
        }
        for (const key in session) {
          if (session[key] = "created_by") {
            if (!Validate.integer(session[key])) {
              ThrowError("INVALID_INPUT", key);
            }
          } else {
            if (!Validate.string(session[key])) {
              ThrowError("INVALID_INPUT", key);
            }
          }
        }
        const updated = await context.db.updateOne("session", { ...session }, { id: id });

        if (!Validate.integer(updated)) {
          ThrowError("DB_ERROR");
        }
        return { state: true };
      } catch (error) {
        await _MySQL.rollback();
        Logger.error("An error occurred in session/session.js updateSession", error);
      }

    },
    deleteSession: async (_, { id }, context) => {
      try {
        await _MySQL.transaction();
        await _MySQL.isolate();

        if (!Validate.integer(context.id)) {
          ThrowError("AUTH_ERROR");
        }
        if (!Validate.integer(id)) {
          ThrowError("INVALID_SESSION_ID");
        }

        const deleted = _MySQL.deleteOne("session", { id: id });

        if (!Validate.integer(deleted)) {
          ThrowError("DB_ERROR");
        }
        return { state: true };
      } catch (error) {
        await _MySQL.rollback();
        Logger.error("An error occurred in session/session.js deleteSession", error);
      }

    },


    addUserToSession: async (_, { session_id }, context) => {
      try {
        await _MySQL.transaction();
        await _MySQL.isolate();

        if (!Validate.integer(context.id)) {
          ThrowError("AUTH_ERROR");
        }
        if (!Validate.integer(session_id)) {
          ThrowError("INVALID_SESSION_ID");
        }

        const object = {
          user_id: context.id,
          session_id: session_id,
          joined_at: DateTime.local().setZone('Africa/Lagos').toLocaleString(DateTime.DATETIME_FULL)
        };

        const inserted = await _MySQL.insertOne("user_session", { ...object });

        if (!Validate.integer(inserted)) {
          ThrowError("DB_ERROR");
        }

        return { state: true };
        
      } catch (error) {
        await _MySQL.rollback();
        Logger.error("An error occurred in session/session.js addUserToSession", error);
        throw error;
      }
    }
  }
};