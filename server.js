var url = require("url");
var botgram = require("botgram");
var express = require("express");

const port = process.env.PORT || 8080;
const token = process.env.TOKEN;
const gameUrl = process.env.GAME_URL;
const gameName = process.env.GAME_NAME;

var bot = botgram(token);
var server = express();

var queries = {};

bot.command("help", function (msg, reply, next) {
  reply.text("This bot implements a dumb minigame. Say /game if you want to play.");
});

bot.command("start", "game", function (msg, reply, next) {
  reply.game(gameName);
});

bot.callback(function (query, next) {
  if (query.gameShortName !== gameName) return next();
  queries[query.id] = query;
  query.answer({
    url: gameUrl
  });
});

server.get("/telegramBot/index.html", function (req, res, next) {
  if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
  console.log("Serving game to %s...", queries[req.query.id].from.name);
  res.sendFile(__dirname + "/index.html");
});

server.listen(port, function () {
  bot.ready(function () {
    console.log("To play, send /game or use the following link to play:\n");
    console.log("  %s\n", bot.linkGame(gameName));
  });
});

// FIXME: use getGameHighScores and display them on game too
