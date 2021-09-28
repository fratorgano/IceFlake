const commandDeployer = require('../deploy-commands.js');
const { deployCommands } = require('../config.json');

// Event: ready
// Description: When the bot is ready, it will say so and set it's initial
//              status, if required in the config it will also deploy the commands
module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity(`over ${client.guilds.cache.size} servers`, { type: 3 });
    if (deployCommands) {
      commandDeployer.registerCommands(client.guilds.cache.keys());
    }
  },
};
