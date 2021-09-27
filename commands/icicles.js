const { SlashCommandBuilder } = require('@discordjs/builders');
const { db } = require('../config.json');
const MonHandler = require('../mon/monHandler.js');

// setting up the mongoose handler with database location, modelname and modelSchema
const mon = new MonHandler(db.uri, db.modelName);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('icicles')
    .setDescription('Replies with how many icicles you have'),
  async execute(interaction) {
    const data = await mon.getDocument(interaction.guild.id);
    const res = data.members.filter(member => member.id === interaction.user.id);
    if (res.length === 0) {
      return interaction.reply('You have no icicles');
    }
    else {
      return interaction.reply(`You have ${res[0].points} icicles`);
    }
  },
};
