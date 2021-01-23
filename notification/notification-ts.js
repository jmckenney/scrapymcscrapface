var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTO_TOKEN;
var client = require("twilio")(accountSid, authToken);
var sendSms = function (searchUrl) {
    client.messages
        .create({
        body: "get on it! " + searchUrl,
        from: process.env.TWILIO_FROM_PHONE,
        to: process.env.TWILIO_TO_PHONE,
    })
        .then(function (message) { return console.debug("sent sms " + message.sid); })
        .done();
};
var newObjTest = {
    this: "that",
    another: "thing",
};
var newObjValues = Object.entries(newObjTest);
module.exports = {
    sendSms: sendSms,
};
