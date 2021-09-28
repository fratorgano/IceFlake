const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { db } = require('../config.json');
const MonHandler = require('../mon/monHandler.js');

// setting up the mongoose handler with database location, modelname and modelSchema
const mon = new MonHandler(db.uri, db.modelName);

// Command: top3
// Description: returns the top 3 icicles holders in the database for the guild that the command was sent in
// Usage: /top3
module.exports = {
  data: new SlashCommandBuilder()
    .setName('top3')
    .setDescription('Shows the server\'s icicles leaderboard'),
  async execute(interaction) {
    // retrieve the guild data from db
    const data = await mon.getDocument(interaction.guildId);

    // if there is no data, reply with error message
    if (data === null) return interaction.reply('No data found for this server');

    // find the top 3 icicles holders
    const best_members = data.members.sort((a, b) => b.points - a.points).filter((_, i) => i < 3);

    // retrieve the current nickname of the top 3 icicles holders
    const nicknames = await Promise.all(best_members.map(async x => {
      const member = await interaction.guild.members.fetch(x.id);
      return await (member.nickname ? member.nickname : member.user.username);
    }));

    // create the embed
    const top3Embed = new MessageEmbed();
    top3Embed.setTitle(':crown: Server\'s leaderboard :crown:');
    top3Embed.setDescription('Here\'s the top 3 members with the most icicles');
    nicknames.forEach((nickname, index) => {
      let title = `${index + 1}. ${nickname}`;
      title += index == 0 ? ' :first_place:' : index == 1 ? ' :second_place:' : ' :third_place:';
      top3Embed.addField(title, `${best_members[index].points} icicles`);
    });

    // reply with the embed
    await interaction.reply({ embeds: [top3Embed] });
  },
};
