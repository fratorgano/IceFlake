const { SlashCommandBuilder } = require('@discordjs/builders');
const { db } = require('../config.json');
const MonHandler = require('../mon/monHandler.js');

// setting up the mongoose handler with database location, modelname
const mon = new MonHandler(db.uri, db.modelName);

// Command: bet
// Description: bet points, you can lose, win or win 10x
// Usage: /bet <amount>
module.exports = {
  data: new SlashCommandBuilder()
    .setName('bet')
    .setDescription('Bet all your icicles, nothing can go wrong ;)')
    .addIntegerOption((option) =>
      option.setName('amount')
        .setRequired(true)
        .setDescription('Amount of icicles to bet'),
    ),
  async execute(interaction) {
    // get the amount of icicles from the db
    const data = await mon.getDocument(interaction.guildId);
    const amount = interaction.options.getInteger('amount');

    // check if the amount is valid
    if (data === null || data.members.length === 0) {
      return interaction.reply('You have no icicles!');
    }
    else if (amount > data.points) {
      return await interaction.reply('You do not have enough icicles to bet.');
    }
    else if (amount < 1) {
      return await interaction.reply('You need to bet at least 1 icicle.');
    }

    // extract a random number between 0 and 99
    const random = Math.floor(Math.random() * 100);
    // if the user is in the guild members list, find him and check if he won
    if (data.members.find(member => member.id === interaction.user.id)) {
      const index = data.members.findIndex(member => member.id === interaction.user.id);
      // if the random number is <50, the user wins 2x the amount
      if (random < 50) {
        data.members[index].points += amount;
        await mon.updateDocument(interaction.guildId, data);
        return await interaction.reply(`You won ${amount * 2} icicles! (Total: ${data.members[index].points}) :blush:`);
      }
      // if the random number is 99, the user wins 10x the amount
      else if (random == 99) {
        data.members[index].points += 10 * amount;
        await mon.updateDocument(interaction.guildId, data);
        return await interaction.reply(`You are incredibly lucky and won ${amount * 10} icicles! (Total: ${data.members[index].points}) :star_struck:`);
      }
      // otherwise the user loses the amount
      else {
        data.members[index].points -= amount;
        await mon.updateDocument(interaction.guildId, data);
        return await interaction.reply(`You lost ${amount} icicles! (Total: ${data.members[index].points}) :cry:`);
      }
    }
  },
};
