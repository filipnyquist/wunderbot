"use strict";

var _discord = _interopRequireDefault(require("discord.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function checkCustomCommand(msg, client) {
  if (msg.channel.type === "dm") return;
  if (msg.author.bot) return;
  const custmcmds = await msg.guild.settings.get("custmcmds", {});
  Object.keys(custmcmds).forEach(cmd => {
    if (msg.content.toLowerCase().indexOf(cmd.toLowerCase()) >= 0) {
      msg.channel.send("", new _discord.default.RichEmbed(custmcmds[cmd].embedbundle));
    }
  });
};