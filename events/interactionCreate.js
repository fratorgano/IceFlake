// Event: interactionCreate
// Description: Called when an interaction(slash command) is created,
//              check if the command is available and if the user has
//              the permissions to use it, if so execute it, otherwise
//              reply with message error.
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    const client = interaction.client;
    // Check if the interaction is available
    if (!interaction.isCommand()) return;

    // Check if the command exists
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Check if the user has the permissions to use the command
    // if there are no permissions required, don't bother checking
    const allowed = !command.permissions ? true : command.permissions.reduce((status, permission) => {
      return status && interaction.member.permissions.has(permission);
    }, true);

    // If the user has the permissions, try to execute the command
    try {
      if (allowed) {
        await command.execute(interaction);
      }
      else {
        // Reply with error message if the user doesn't have the permissions
        interaction.reply({
          content: 'You do not have permission to use this command.',
          ephemeral: true,
        });
      }
    }
    // Catch any errors that may occur
    catch (error) {
      // Log the error
      console.error(error);
      // Reply with error message to the user
      await interaction.reply({
        content: 'There was an error while executing this command.',
        ephemeral: true,
      });
    }
  },
};
