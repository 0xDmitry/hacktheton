import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"

export async function POST(request: NextRequest) {
  const data = await request.json()

  const transport = nodemailer.createTransport({
    service: "gmail",
    /* 
      setting service as 'gmail' is same as providing these setings:
      host: "smtp.gmail.com",
      port: 465,
      secure: true
      If you want to use a different email provider other than gmail, you need to provide these manually.
      Or you can go use these well known services and their settings at
      https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json
  */
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const sendMailPromise = async () => {
    const mailOptions: Mail.Options = {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: "Level application",
      html: Object.entries(data)
        .map(([key, value]) => `<h3>${key}</h3><p>${value}</p>`)
        .join(""),
    }

    return new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent")
        } else {
          reject(err.message)
        }
      })
    })
  }

  try {
    const message = await sendMailPromise()
    return NextResponse.json({ message })
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
