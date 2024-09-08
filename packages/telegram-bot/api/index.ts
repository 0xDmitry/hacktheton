import { Telegraf } from "telegraf"

import dotenv from "dotenv"
dotenv.config()

const bot = new Telegraf(process.env.TG_BOT_TOKEN!)

bot.start((ctx) => ctx.reply("Welcome to the TON based wargame Hack the TON!"))

bot.launch({
  webhook: {
    domain: process.env.WEBHOOK_DOMAIN!,
  },
})

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
