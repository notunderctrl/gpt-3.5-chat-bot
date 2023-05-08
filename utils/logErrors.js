const { WebhookClient } = require('discord.js');

const WEBHOOK_URL = process.env.LOGS_WEBHOOK_URL;

let webhookClient = new WebhookClient({ url: WEBHOOK_URL });

console.log(webhookClient);

module.exports = async (reason) => {
  try {
    if (!WEBHOOK_URL) {
      console.log(`Error (No webhook URL found, using console):\n${reason}`);
      return;
    }

    await webhookClient.send({ content: '```' + reason + '```' });
  } catch (error) {
    console.log(`logErrors.js: ${error}`);
  }
};
