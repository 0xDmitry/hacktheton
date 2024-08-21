import { Twitter } from "@/components/assets/socials/Twitter"
import { Telegram } from "@/components/assets/socials/Telegram"
import { Discord } from "@/components/assets/socials/Discord"
import { GitHub } from "@/components/assets/socials/GitHub"

export const Footer = () => (
  <footer className="flex justify-center items-center p-6 gap-2">
    <a href="https://x.com/hacktheton" target="_blank">
      <div className="rounded-full size-full hover:bg-gray-600 transition duration-500">
        <Twitter />
      </div>
    </a>
    <a href="https://t.me/hacktheton" target="_blank">
      <div className="rounded-full size-full hover:bg-gray-600 transition duration-500">
        <Telegram />
      </div>
    </a>
    <a href="https://discord.gg/vaFRDfG4uz" target="_blank">
      <div className="rounded-full size-full hover:bg-gray-600 transition duration-500">
        <Discord />
      </div>
    </a>
    <a href="https://github.com/0xDmitry/hacktheton" target="_blank">
      <div className="rounded-full size-full hover:bg-gray-600 transition duration-500">
        <GitHub />
      </div>
    </a>
  </footer>
)
