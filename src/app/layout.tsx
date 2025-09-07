import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YTonic",
  description: "Convierte y descarga videos de YouTube en baja/media/alta calidad MP3 o MP4",
  icons: {
    icon: [
      { url: '/icon-yt.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/icon-yt.jpg', sizes: '16x16', type: 'image/jpeg' },
    ],
    apple: '/icon-yt.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon-yt.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/icon-yt.jpg" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7692639932873351"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-inter antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
