const admin = require("firebase-admin");
const serviceAccount = require("../firebase.json");

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging(firebaseApp);

async function sendMessage(fcm_token, title, body) {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        keydumm: "valuedumm",
      },
      token: fcm_token,
    };

    const response = await messaging.send(message);
    return response;
  } catch (error) {
    console.log(error);
    error.statusCode = 500;
    throw error;
  }
}

module.exports = { sendMessage };