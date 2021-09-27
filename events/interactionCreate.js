module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    const client = interaction.client;
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    // if there are no permissions required, don't bother checking
    const allowed = !command.permissions ? true : command.permissions.reduce((status, permission) => {
      return status && interaction.member.permissions.has(permission);
    }, true);

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
