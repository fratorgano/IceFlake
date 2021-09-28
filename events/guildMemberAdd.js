// Event: guildMemberAdd
// Description: Whenever an user joins the guild, reverse his username.
module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // Reverse the username.
    member.setNickname(`${member.user.username.split('').reverse().join('')}`);
  },
};
