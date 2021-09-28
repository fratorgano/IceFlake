const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { applicationID, token } = require('./config.json');

class commandDeployer {
  static registerCommands(guilds) {
    const commands = [];
    const commandFiles = fs
      .readdirSync('./commands')
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(token);

    for (const guildId of guilds) {
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
