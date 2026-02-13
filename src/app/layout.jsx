
import { Geist, Geist_Mono, Imprima } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import Navbar from "./components/engines/Navbar"
import config from "../../localConfig"
import TelegramBackButton from './components/engines/TelegramBackButton';

const terminalFont = localFont({
  src: './JetBrainsMonoNL-Regular.ttf',
  variable: '--font-terminal',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Webochan",
  description: "Tablón de mensajes anónimos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={terminalFont.variable}>
      <head>
        <meta
          name="google-site-verification"
          content={config.googleSiteVerification} />
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Navbar />
        <main >
          <TelegramBackButton />
          {children}
        </main>

      </body>
    </html>
  );
}
