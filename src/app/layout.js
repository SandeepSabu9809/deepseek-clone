import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "../../context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const toastConfig = {
  success: { style: { background: "black", color: "white" } },
  error: { style: { background: "black", color: "white" } },
};

export const metadata = {
  title: "deepseek-clone",
  description: "Full Stack App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

       {/* PWA meta tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/favicon.ico" />

      <body className={`${inter.className} antialiased`}>
        <ClerkProvider>
          <AppContextProvider>
            {children}
          </AppContextProvider>
          <Toaster toastOptions={toastConfig} />
        </ClerkProvider>
      </body>
    </html>
  );
}
