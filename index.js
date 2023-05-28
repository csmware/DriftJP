const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
require("dotenv").config();
const replies = require("./replies");
const userCoins = {};
let botBalance = 0;

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    "Привет гонщик, добро пожаловать в Токио! Если у тебя есть какие то вопросы пиши /help."
  )
);
bot.help((ctx) => ctx.reply(replies.help));

bot.on("text", (ctx) => {
  const text = ctx.message.text.toLowerCase();
  if (text === "/drift") {
    // Добавим шанс проигрыша в игре (10%)
    if (Math.random() < 0.1) {
      const lostCoins = Math.floor(Math.random() * 5) + 1;
      botBalance -= lostCoins;
      ctx.reply(
        `К сожалению, вы потеряли ${lostCoins} монет. Баланс бота: ${botBalance} монет.`
      );
    } else {
      const earnedCoins = Math.floor(Math.random() * 10) + 1;
      botBalance += earnedCoins;

      let replyText = `Вы успешно выполнили дрифт! Заработано ${earnedCoins} монет. Баланс бота: ${botBalance} монет.`;

      // Добавим разнообразие в текстовые ответы после каждого дрифта
      const randomNum = Math.random();
      if (randomNum < 0.3) {
        replyText += " Отличный дрифт!";
      } else if (randomNum < 0.6) {
        replyText += " Продолжайте в том же духе!";
      } else {
        const negativeResponses = ["Неудачный дрифт!", "Могло быть лучше..."];
        const randomIndex = Math.floor(
          Math.random() * negativeResponses.length
        );
        replyText += ` ${negativeResponses[randomIndex]}`;
      }

      ctx.reply(replyText);
    }
  } else {
    ctx.reply('Неверная команда. Введите "/drift" для выполнения дрифта.');
  }
});
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
