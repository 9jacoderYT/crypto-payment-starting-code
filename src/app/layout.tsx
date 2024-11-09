import { Barlow } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "@/components/wrapper/layoutwrapper";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you need
  variable: "--font-primary",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "9jacoder",
  description: "Learn crypto payments with 9jacoder",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
