const { WebhookClient } = require('discord.js');

const WEBHOOK_URL = process.env.LOGS_WEBHOOK_URL;

let webhookClient = WEBHOOK_URL && new WebhookClient({ url: WEBHOOK_URL });

module.exports = async (reason) => {
  try {
    if (!WEBHOOK_URL) {
      console.log(`No webhook URL found, using console to log errors:\n${reason}`);
      return;
    }

    await webhookClient.send({ content: '```' + reason + '```' });
  } catch (error) {
    console.log(`logErrors.js: ${error}`);
  }
};
