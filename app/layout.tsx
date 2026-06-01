import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexso.cl"),
  title: "Nexso | Soluciones tecnológicas y transformación digital",
  description:
    "Desarrollamos software a medida e integraciones para el Estado y empresas en Chile. De la idea al objetivo en días, con IA y maquetas en menos de 24 horas.",
  openGraph: {
    title: "Nexso | Soluciones tecnológicas y transformación digital",
    description:
      "Software a medida, consultoría TI e integraciones para sector público y privado en Chile.",
    type: "website",
    locale: "es_CL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
