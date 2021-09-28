const commandDeployer = require('../deploy-commands.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    // commandDeployer.registerCommands(client.guilds.cache.keys());
    client.user.setActivity(`over ${client.guilds.cache.size} servers`, { type: 3 });
  },
};
