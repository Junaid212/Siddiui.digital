const webhookHandler = require('../stripe/webhook');
module.exports = webhookHandler;
module.exports.config = webhookHandler.config;
