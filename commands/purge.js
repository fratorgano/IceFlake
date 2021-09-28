const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, DiscordAPIError } = require('discord.js');

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
    const number = interaction.options.getInteger('number');
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

    try {
      await interaction.channel.bulkDelete(number);
    }
    catch (e) {
      if (e instanceof DiscordAPIError && e.code === 50034) {
        return await interaction.reply({
          content: 'You can only delete messages that are under 14 days old.',
          ephemeral: true,
        });
      }
      else {
        return await interaction.reply({
          content: 'There was an error while trying to delete message, please try again later.',
          ephemeral: true,
        });
      }
    }
    await interaction.reply({
      content: 'Messages deleted!',
      ephemeral: true,
    });
  },
};
