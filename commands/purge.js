const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, DiscordAPIError } = require('discord.js');

// Command: purge
// Description: Deletes a number of messages from the channel the command was sent in
// Usage: /purge <number of messages to delete>
// Permissions: MANAGE_MESSAGES (users needs to be able to manage message serverwide to use this)
module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete messages')
    .addIntegerOption((option) =>
      option
        .setName('number')
        .setDescription('The number of messages to delete')
        .setRequired(true),
    ),
  permissions: [Permissions.FLAGS.MANAGE_MESSAGES],
  async execute(interaction) {
    // Get the number of messages to delete
    const number = interaction.options.getInteger('number');
    // Check if the number is valid
    if (number > 100) {
      return await interaction.reply({
        content: 'You can only delete up to 100 messages at a time.',
        ephemeral: true,
      });
    }
    else if (number < 1) {
      return await interaction.reply({
        content: 'You can only delete at least 1 message.',
        ephemeral: true,
      });
    }
    // Try to delete the messages
    try {
      // Delete the messages
      await interaction.channel.bulkDelete(number);
    }
    catch (e) {
      // Check if the error is a Discord API error with code 50034
      if (e instanceof DiscordAPIError && e.code === 50034) {
        // Reply that you can't delete messages that are older than 2 weeks
        return await interaction.reply({
          content: 'You can only delete messages that are under 14 days old.',
          ephemeral: true,
        });
      }
      else {
        // Reply with a generic error message
        return await interaction.reply({
          content: 'There was an error while trying to delete message, please try again later.',
          ephemeral: true,
        });
      }
    }
    // Reply with a success message
    await interaction.reply({
      content: 'Messages deleted!',
      ephemeral: true,
    });
  },
};
