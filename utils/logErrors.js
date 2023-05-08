const { WebhookClient, EmbedBuilder } = require('discord.js');

let webhookClient;

const WEBHOOK_URL = process.env.LOGS_WEBHOOK_URL;

WEBHOOK_URL && (webhookClient = new WebhookClient({ url: WEBHOOK_URL }));

module.exports = async (reason) => {
  try {
    if (!WEBHOOK_URL) {
      console.log(`Error (No webhook URL found, using console):\n${reason}`);
      return;
    }

    const embed = new EmbedBuilder({
      title: 'Error log',
      description: reason,
      timestamp: Date.now(),
    });

    await webhookClient.send({ embeds: [embed] });
  } catch (error) {
    console.log(`logErrors.js: ${error}`);
  }
};
