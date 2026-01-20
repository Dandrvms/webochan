
import { Geist, Geist_Mono, Imprima } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import Navbar from "./components/Navbar"

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
  title: "Webo",
  description: "Tablón de mensajes anónimos",
};

export default function RootLayout({ children }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  return (
    <html lang="en" className={terminalFont.variable}>
      <body
        
      >
         <Navbar />
        <main >
          {children}
        </main>

      </body>
    </html>
  );
}
