import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "../../context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// ✅ Move toastOptions outside the component
const toastConfig = {
  success: { style: { background: "black", color: "white" } },
  error: { style: { background: "black", color: "white" } }
};

export const metadata = {
  title: "deepseek-clone",
  description: "Full Stack App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <html lang="en">
          <body className={`${inter.className} antialiased`}>
            <Toaster toastOptions={toastConfig} />
            {children}
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
