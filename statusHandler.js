const statuses = [
  // 0 -> Playing {string}
  ['Chess', 0], ['with bet odds', 0], ['Minecraft', 0], ['with Node.js', 0], ['with database files', 0],
  // 2 -> Listening to {string}
  ['Spotify', 2], ['Lofi', 2],
  // 3 -> Watching {string}
  ['online classes', 3], ['you lose icicles', 3] ['you win icicles', 3],
  // 5 -> Competing in {string}
  ['a bot gauntlet', 5],
];

class statusHandler {
  static getStatus() {
    const [name, type] = statuses[Math.floor(Math.random() * statuses.length)];

    return [name, { type: type }];
  }
}

module.exports = statusHandler;