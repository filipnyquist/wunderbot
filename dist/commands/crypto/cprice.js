"use strict";

var _discord = _interopRequireDefault(require("discord.js-commando"));

var _discord2 = _interopRequireDefault(require("discord.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class UserInfoCommand extends _discord.default.Command {
  constructor(client) {
    super(client, {
      name: "cprice",
      aliases: ["cp"],
      group: "crypto",
      memberName: "cprice",
      description: "Displays price of a specific alt coin from cryptocompare.",
      examples: ["cprice BTC USD 1", "cprice LBC EUR 100"],
      guildOnly: false,
      args: [{
        key: "coin",
        label: "coin",
        prompt: "What coin would you like to check the value of?",
        type: "string"
      }, {
        key: "fiat",
        label: "fiat",
        prompt: "The fiat currency to check?",
        type: "string"
      }, {
        key: "amount",
        label: "amount",
        prompt: "The number of coins to check the value of?",
        type: "float"
      }]
    });
  }

  async run(msg, {
    coin,
    fiat,
    amount
  }) {
    try {
      const url = `https://min-api.cryptocompare.com/data/price?fsym=${coin.toUpperCase()}&tsyms=${fiat.toUpperCase()}`;
      const {
        body,
        headers
      } = await this.client.request({
        url,
        cacheKey: url,
        cacheTTL: 120000,
        cacheLimit: 3,
        resolveWithFullResponse: true
      });
      console.log(headers);
      const embed = new _discord2.default.RichEmbed().setTitle(`The value of ${amount} ${coin.toUpperCase()} in ${fiat.toUpperCase()}`).setColor(0x00ae86).setFooter("Wunderbot | Cryptocompare API", "http://i.imgur.com/w1vhFSR.png").setTimestamp(new Date(Date.parse(headers.date))).setURL(`https://www.cryptocompare.com/coins/${coin.toLowerCase()}/overview/${fiat.toLowerCase()}`).addField("Price per coin", `The price per coin is ${JSON.parse(body)[fiat.toUpperCase()]} ${fiat.toUpperCase()}`).addField("Result", `The value of ${amount} ${coin.toUpperCase()} is ${JSON.parse(body)[fiat.toUpperCase()] * amount} ${fiat.toUpperCase()}`);
      msg.reply(embed);
    } catch (e) {
      console.log(e);
      return msg.reply("Could not talk to the cryptocompare API. Try again later.");
    }
  }

};