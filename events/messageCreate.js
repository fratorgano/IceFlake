const { db } = require('../config.json');
const MonHandler = require('../mon/monHandler.js');

// setting up the mongoose handler with database location, modelname
const mon = new MonHandler(db.uri, db.modelName);

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.member.user.bot) return;
    const data = await mon.getDocument(message.guildId);
    if (data === null) {
      const newData = {
        _id: message.guildId,
        members: [{ id: message.author.id, points: message.content.length }],
      };
      mon.updateDocument(message.guildId, newData);
    }
    else {
      if (data.members.find(member => member.id === message.author.id)) {
        const index = data.members.findIndex(member => member.id === message.author.id);
        data.members[index].points += message.content.length;
      }
      else {
        data.members.push({ id: message.author.id, points: message.content.length });
      }
      mon.updateDocument(message.guildId, data);
    }
  },
};
