"use strict";

var _discord = _interopRequireDefault(require("discord.js"));

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _passport = _interopRequireDefault(require("passport"));

var _passportDiscord = _interopRequireDefault(require("passport-discord"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000; // Setup passport for discord usage

_passport.default.serializeUser((user, done) => {
  done(null, user);
});

_passport.default.deserializeUser((obj, done) => {
  done(null, obj);
});

const scopes = ["identify", "guilds"];

_passport.default.use(new _passportDiscord.default({
  clientID: _config.default.get("Web.clientID"),
  clientSecret: _config.default.get("Web.clientSecret"),
  callbackURL: "http://localhost:3000/callback",
  scope: scopes
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
})); // Function to check authentication status


function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.send("not logged in :(");
} // Returns all the guilds a user can control


function canControlGuilds(guilds) {
  return guilds.filter(g => {
    gp = new _discord.default.Permissions(null, g.permissions);
    return gp.has("MANAGE_GUILD");
  });
} // Lets get some sessions going!


app.use((0, _expressSession.default)({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true
}));
app.use(_passport.default.initialize());
app.use(_passport.default.session()); // Standard routes

app.get("/login", _passport.default.authenticate("discord", {
  scope: scopes
}), (req, res) => {});
app.get("/callback", _passport.default.authenticate("discord", {
  failureRedirect: "/me"
}), (req, res) => {
  res.redirect("/me");
} // auth success
);
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.get("/me", checkAuth, (req, res) => {
  res.json(req.user);
}); // Time to run?!

module.exports = async function run(client) {
  app.listen(port, host);
  console.log(`Webserver listening on ${host}:${port}`); // eslint-disable-line no-console
};