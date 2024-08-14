import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"
// import express from "express"

import dotenv from "dotenv"
dotenv.config()

const bot = new Telegraf(process.env.TG_BOT_TOKEN!)

bot.start((ctx) =>
  ctx.reply(
    "Welcome to the TON based wargame Hack the TON! Wow you are so early!"
  )
)

bot.on(message("text"), (ctx) => {
  ctx.reply("Coming soon!")
})

bot.launch({
  webhook: {
    domain: process.env.WEBHOOK_DOMAIN!,
  },
})

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

// const app = express()

// app.use(await bot.createWebhook({ domain: process.env.WEBHOOK_DOMAIN! }))

// app.get("/", (_, res) => {
//   res.send("Running")
// })

// export default app
