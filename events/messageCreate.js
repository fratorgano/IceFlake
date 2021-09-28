const { db } = require('../config.json');
const MonHandler = require('../mon/monHandler.js');

// setting up the mongoose handler with database location, modelname
const mon = new MonHandler(db.uri, db.modelName);

// Event: messageCreate
// Description: This event will be triggered when a new message is created
//              in a channel that the bot has access to, if the author is
//              not a bot, he will gain points, if he has no points, a new
//              document in the db will be created otherwide the document
//              will be updated.
module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // if the author is a bot, return
    if (message.member.user.bot) return;

    // if the author is not a bot, check if the guild has a document in the db
    const data = await mon.getDocument(message.guildId);

    // if there's no document, create one and add the user to the list of users
    if (data === null) {
      const newData = {
        _id: message.guildId,
        members: [{ id: message.author.id, points: message.content.length }],
      };
      mon.updateDocument(message.guildId, newData);
    }
    else {
      // if there is a document, check if the user is in the list of users
      if (data.members.find(member => member.id === message.author.id)) {
        // if the user is in the list, update the points
        const index = data.members.findIndex(member => member.id === message.author.id);
        data.members[index].points += message.content.length;
      }
      else {
        // if the user is not in the list, add him to the list and give him points
        data.members.push({ id: message.author.id, points: message.content.length });
      }
      mon.updateDocument(message.guildId, data);
    }
  },
};
