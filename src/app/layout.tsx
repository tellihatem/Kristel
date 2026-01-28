import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Trade Virtual",
  description: "Professional virtual trading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <Navbar />
        <Sidebar />
        <div className="p-4 sm:ml-64 pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
