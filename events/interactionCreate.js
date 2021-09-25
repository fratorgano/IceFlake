module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    const client = interaction.client;
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    const allowed = command.permissions.reduce((status, permission) => {
      return status && interaction.member.permissions.has(permission);
    }, true);

    /* command.permissions.forEach((permission) => {
      console.log('Testing permission: ', permission);
      if (!interaction.member.permissions.has(permission)) {
        console.log('not enough permissions');
        return;
      }
    }); */

    try {
      if (allowed) {
        await command.execute(interaction);
      }
      else {
        interaction.reply({
          content: 'You do not have permission to use this command.',
          ephemeral: true,
        });
      }
    }
    catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command.',
        ephemeral: true,
      });
    }
  },
};
