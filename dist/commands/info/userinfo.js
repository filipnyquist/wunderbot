"use strict";

var _moment = _interopRequireDefault(require("moment"));

var _discord = require("discord.js-commando");

var _discord2 = require("discord.js");

var _util = require("../../util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class UserInfoCommand extends _discord.Command {
  constructor(client) {
    super(client, {
      name: "userinfo",
      memberName: "userinfo",
      group: "info",
      aliases: ["user", "uinfo"],
      description: "Gets information about a user.",
      format: "MemberID|MemberName(partial or full)",
      examples: ["uinfo @Fillerino"],
      guildOnly: true,
      args: [{
        key: "member",
        prompt: "What user would you like to snoop on?",
        type: "member"
      }]
    });
  }

  run(msg, {
    member
  }) {
    const uinfoEmbed = new _discord2.RichEmbed();
    uinfoEmbed.setAuthor(member.user.tag).setThumbnail(member.user.displayAvatarURL).setColor(member.displayHexColor).addField("ID", member.id, true).addField("Name", member.user.username, true).addField("Nickname", member.nickname ? member.nickname : "No Nickname", true).addField("Status", member.user.presence.status !== "dnd" ? (0, _util.capitalizeFirstLetter)(member.user.presence.status) : "Do Not Disturb", true).addField(member.user.presence.activity ? (0, _util.capitalizeFirstLetter)(member.user.presence.activity.type) : "Activity", member.user.presence.activity ? member.user.presence.activity.name : "Nothing", true).addField("Display Color", member.displayHexColor, true).addField("Role(s)", member.roles.size > 1 ? (0, _util.arrayClean)(null, member.roles.map(r => {
      if (r.name !== "@everyone") {
        return r.name;
      }

      return null;
    })).join(" | ") : "None", false).addField("Account created at", (0, _moment.default)(member.user.createdAt).format("MMMM Do YYYY [at] HH:mm:ss [UTC]Z"), true).addField("Joined server at", (0, _moment.default)(member.joinedAt).format("MMMM Do YYYY [at] HH:mm:ss [UTC]Z"), true);
    member.roles.size >= 1 ? uinfoEmbed.setFooter(`${member.displayName} has ${member.roles.size - 1} role(s)`) : uinfoEmbed.setFooter(`${member.displayName} has 0 roles`);
    (0, _util.deleteCommandMessages)(msg, this.client);
    return msg.embed(uinfoEmbed);
  }

};