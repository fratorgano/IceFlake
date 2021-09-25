const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reverse')
    .setDescription('Reverses user\'s nickname!')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to reverse the nickname of.')
        .setRequired(true),
    ),
  permissions: [Permissions.FLAGS.MANAGE_NICKNAMES],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    if (member.nickname === null) {
      member.setNickname(
        `${member.user.username.split('').reverse().join('')}`,
      );
    }
    else {
      member.setNickname(`${member.nickname.split('').reverse().join('')}`);
    }
    await interaction.reply({
      content: 'Changing user\'s nickname!',
      ephemeral: true,
    });
  },
};
