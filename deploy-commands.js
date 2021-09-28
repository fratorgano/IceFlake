const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { applicationID, token } = require('./config.json');

// Class that allows to register slash commands on discord server
// it needs to be done for each server that the bot connects to
// it also needs to be done for each command that the bot needs to register

class commandDeployer {
  static registerCommands(guilds) {
    const commands = [];
    // read directory with commands
    const commandFiles = fs
      .readdirSync('./commands')
      .filter((file) => file.endsWith('.js'));

    // load commands
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(token);

    // for each guild that the bot is connected to
    for (const guildId of guilds) {
      // register all the commands
      rest
        .put(Routes.applicationGuildCommands(applicationID, guildId), {
          body: commands,
        })
        .then(() => console.log('Successfully registered application commands for', guildId))
        .catch(console.error);
    }
  }
}

module.exports = commandDeployer;
