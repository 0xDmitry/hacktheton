import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"
import express from "express"

import dotenv from "dotenv"
dotenv.config()

const app = express()

const bot = new Telegraf(process.env.TG_BOT_TOKEN!)
app.use(await bot.createWebhook({ domain: process.env.WEBHOOK_DOMAIN! }))

bot.start((ctx) => ctx.reply("Hello!"))

bot.on(message("text"), async (ctx) => {
  await ctx.reply("Yeah yeah yeah")
})

bot.launch()

app.get("/", (_, res) => {
  res.send("Telegram bot is ready!")
})

export default app
