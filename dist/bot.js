"use strict";

var _discord = _interopRequireDefault(require("discord.js-commando"));

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("config"));

var _commonTags = require("common-tags");

var _mongodb = require("mongodb");

var _commandoProviderMongo = _interopRequireDefault(require("commando-provider-mongo"));

var _requestPromiseCache = _interopRequireDefault(require("request-promise-cache"));

var _customCommands = _interopRequireDefault(require("./helpers/customCommands"));

var _controlPanel = _interopRequireDefault(require("./web/controlPanel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class Wunderbot extends _discord.default.Client {
  constructor() {
    super({
      owner: _config.default.get("Wunderbot.owner"),
      commandPrefix: _config.default.get("Wunderbot.defaultPrefix")
    }); // Add our own version of request with cache support :)

    this.request = _requestPromiseCache.default; // ADD our custom commands helper :)

    this.on("message", msg => {
      (0, _customCommands.default)(msg, this);
    });
    this.on("error", console.error).on("warn", console.warn) // .on("debug", console.log)
    .on("ready", () => {
      console.log(`##      ## ##     ## ##    ## ########  ######## ########  ########   #######  ########
##  ##  ## ##     ## ###   ## ##     ## ##       ##     ## ##     ## ##     ##    ##
##  ##  ## ##     ## ####  ## ##     ## ##       ##     ## ##     ## ##     ##    ##
##  ##  ## ##     ## ## ## ## ##     ## ######   ########  ########  ##     ##    ##
##  ##  ## ##     ## ##  #### ##     ## ##       ##   ##   ##     ## ##     ##    ##
##  ##  ## ##     ## ##   ### ##     ## ##       ##    ##  ##     ## ##     ##    ##
 ###  ###   #######  ##    ## ########  ######## ##     ## ########   #######     ##

`);
      console.log(`Client ready; logged in as ${this.user.username}#${this.user.discriminator} (${this.user.id})`);
    }).on("disconnect", () => {
      console.warn("Disconnected!");
    }).on("reconnecting", () => {
      console.warn("Reconnecting...");
    }).on("commandError", (cmd, err) => {
      if (err instanceof _discord.default.FriendlyError) return;
      console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    }).on("commandBlocked", (msg, reason) => {
      console.log(_commonTags.oneLine`
                Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""}
                blocked; ${reason}
            `);
    }).on("commandPrefixChange", (guild, prefix) => {
      console.log(_commonTags.oneLine`
                Prefix ${prefix === "" ? "removed" : `changed to ${prefix || "the default"}`}
                ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
            `);
    }).on("commandStatusChange", (guild, command, enabled) => {
      console.log(_commonTags.oneLine`
                Command ${command.groupID}:${command.memberName}
                ${enabled ? "enabled" : "disabled"}
                ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
            `);
    }).on("groupStatusChange", (guild, group, enabled) => {
      console.log(_commonTags.oneLine`
                Group ${group.id}
                ${enabled ? "enabled" : "disabled"}
                ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
            `);
    });
    this.setProvider(_mongodb.MongoClient.connect(_config.default.get("Wunderbot.dbUrl"), {
      useNewUrlParser: true
    }).then(client => new _commandoProviderMongo.default(client.db(_config.default.get("Wunderbot.dbName"))))).catch(console.error);
    this.registry.registerDefaults().registerGroup("info", "Info").registerGroup("crypto", "Crypto").registerTypesIn(_path.default.join(__dirname, "types")).registerCommandsIn(_path.default.join(__dirname, "commands"));
    this.login(_config.default.get("Wunderbot.token")); // controlPanel(this); // Lets start the control panel!
  }

};