const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, db } = require('./config.json');
const MonHandler = require('./mon/monHandler.js');
const iciclesSchema = require('./mon/monIcicles.js');
const statusHandler = require('./statusHandler.js');

// setting up db
// create a new mongodb handler
const mon = new MonHandler(db.uri, db.modelName);
// setting up model for db
mon.createModel(iciclesSchema);

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

// create collection to hold commands
client.commands = new Collection();

// read directory with commands
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

// read directory with event handlers
const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

// load commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// load event handlers
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  }
  else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Handling custom statuses
setInterval(() => {
  const [status, options] = statusHandler.getStatus();
  client.user.setActivity(status, options);
}, 600000);

// Login to Discord with your client's token
client.login(token);
