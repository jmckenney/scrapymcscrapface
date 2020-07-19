const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTO_TOKEN;
const client = require("twilio")(accountSid, authToken);

const sendSms = (searchUrl) => {
  client.messages
    .create({
      body: `get on it! ${searchUrl}`,
      from: process.env.TWILIO_FROM_PHONE,
      to: process.env.TWILIO_TO_PHONE,
    })
    .then((message) => console.debug("sent sms " + message.sid))
    .done();
};

modules.exports = {
  sendSms,
};
