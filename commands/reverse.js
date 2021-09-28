const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

// Command: reverse
// Description: Reverses a user's nickname
// Usage: /reverse <user>
// Permissions: MANAGE_NICKNAMES (the user needs to be able to change nicknames serverwide)
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
    // get the user to reverse the nickname of
    const member = interaction.options.getMember('user');
    // if the user doesn't have a nickname, reverse his username and set is a nickname
    if (member.nickname === null) {
      member.setNickname(
        `${member.user.username.split('').reverse().join('')}`,
      );
    }
    // if the user does have a nickname, reverse his nickname and set it
    else {
      member.setNickname(`${member.nickname.split('').reverse().join('')}`);
    }
    // reply with confirmation
    await interaction.reply({
      content: 'Changing user\'s nickname!',
      ephemeral: true,
    });
  },
};
