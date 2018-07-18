"use strict";

var _discord = require("discord.js-commando");

module.exports = class IDCommand extends _discord.Command {
  constructor(client) {
    super(client, {
      name: "id",
      aliases: ["user-id", "member-id"],
      group: "info",
      memberName: "id",
      description: "Responds with a user's ID.",
      args: [{
        key: "user",
        prompt: "Which user do you want to get the ID of?",
        type: "user",
        default: msg => msg.author
      }]
    });
  }

  run(msg, {
    user
  }) {
    deleteCommandMessages(msg, this.client);
    return msg.say(`${user.username}'s ID is ${user.id}.`);
  }

};