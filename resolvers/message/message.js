const Validate = require("../../helpers/Validate");
const { sendMessage } = require("../../helpers/notifications");

module.exports = {
  Query: {

  },
  Mutation: {
    sendMessage: async (_, { message }, context) => {
      try {
        
        if (!Validate.integer(context.id)) {
          ThrowError("AUTH_ERROR");
        }
        const { from, fcm_token, messageValue } = message;

        await sendMessage(fcm_token, "You have a new message from " + from, messageValue);

        return { state: true };
      } catch (error) {
        Logger.error("An error occured in sendMessage", error);
        throw error;
      }

    }
  }
};