import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, Poppins, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";

const sora = Sora({
  subsets: ["latin"],
  weight : ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const bebas_Neue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "AGNI Robotics",
  description: "",
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.className} ${jakarta.className} antialiased`}>
      <body>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
