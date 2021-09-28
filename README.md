# IceFlake
Discord bot developed in Javascript using Node.js and Discord.js, it relies on MongoDB for data storage.

## Features
* Slash commands
* Currency(icicles) system
* Random status
* Promise based
* Dynamic command handling
* Dynamic event handling

## Commands
* bet - Allows you to bet your icicles
* icicles - Show the amount of icicles that you have
* movie - Allows you to lookup information about a movie
* ping - Replies with pong and the delay to the bot
* purge - Deleted a number of messages
* top3 - Shows the top 3 icicles holder for the server it was sent in 

## Try it
If you want to try it on your local machine, you just need to run some simple commands
1. Either download the repo or clone it (git clone https://github.com/fratorgano/IceFlake/)
1. Go to the folder you cloned it to
1. Run the following commands
    1. npm install (Which install all the modules needed, it shouldn't fail but if it does, just run it again)
    1. copy the configExample.json file to a config.json file and edit it with the correct info
    1. npm start

## Dependencies/Modules Used
* [Node.js](https://github.com/nodejs/node) - Javascript runtime
* [Discord.js](https://discord.js.org/#/) - Library to interface with Discord API
* [Mongoose](https://mongoosejs.com/) -  Library to interface with MongoDB
* [Axios](https://github.com/axios/axios) - Promise based HTTP client for node.js

## License
Trenode.js is released under the MIT License.

