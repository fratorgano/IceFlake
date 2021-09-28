const { SlashCommandBuilder } = require('@discordjs/builders');
const { db } = require('../config.json');
const MonHandler = require('../mon/monHandler.js');

// setting up the mongoose handler with database location, modelname
const mon = new MonHandler(db.uri, db.modelName);

// Command: icicles
// Description: returns the number of icicles the user has
// Usage: /icicles
module.exports = {
  data: new SlashCommandBuilder()
    .setName('icicles')
    .setDescription('Replies with how many icicles you have'),
  async execute(interaction) {
    // get the guild document
    const data = await mon.getDocument(interaction.guild.id);
    // find the user in the guild document
    const res = data.members.filter(member => member.id === interaction.user.id);
    // if the user is not in the guild document, reply with error
    if (res.length === 0) {
      return interaction.reply('You have no icicles');
    }
    else {
      // otherwise reply with the number of icicles the user has
      return interaction.reply(`You have ${res[0].points} icicles`);
    }
  },
};
