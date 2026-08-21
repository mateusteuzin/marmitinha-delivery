import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marmitinha-delivery-cardapio.gamesflaxaropinho.chatgpt.site"),
  title: "Marmitinha Delivery | Cardápio digital",
  description: "Cuscuz, tapioca e bebidas. Monte seu pedido e envie pelo WhatsApp.",
  openGraph: {
    title: "Marmitinha Delivery",
    description: "Cuscuz, tapioca e bebidas. Monte seu pedido e envie pelo WhatsApp.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Marmitinha Delivery — feito com carinho, entregue com amor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marmitinha Delivery",
    description: "Cuscuz, tapioca e bebidas. Monte seu pedido e envie pelo WhatsApp.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon-cuscuz.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon-cuscuz.png",
    apple: "/favicon-cuscuz.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
