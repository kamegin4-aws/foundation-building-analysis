import "@cloudscape-design/global-styles/index.css";
import { Inter } from "next/font/google";
//import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Foundation Building App",
  description: "基本基盤アプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
