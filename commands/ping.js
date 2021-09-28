const { SlashCommandBuilder } = require('@discordjs/builders');

// Command: ping
// Description: Returns the bot's latency
// Usage: /ping
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    // calculate the latency and send it back to the user
    await interaction.reply(`Pong! (${(Date.now() - interaction.createdAt)}ms)`);
  },
};
