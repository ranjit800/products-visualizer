import "./globals.css";
import { Roboto_Flex } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";

const roboto = Roboto_Flex({ subsets: ["latin"] });

const metadata = {
  title: "Try It First",
  description: "Try It First",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
