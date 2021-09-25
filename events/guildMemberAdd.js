module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    member.setNickname(`${member.user.username.split('').reverse().join('')}`);
  },
};
