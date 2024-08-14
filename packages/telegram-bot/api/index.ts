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
  await ctx.reply(
    "Welcome to the TON based wargame Hack the TON! You are so early..."
  )
})

bot.launch()

app.get("/", (_, res) => {
  res.send("Coming soon!")
})

export default app
