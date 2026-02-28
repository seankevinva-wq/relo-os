import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Relo OS — RSG Command Center",
  description: "AI-powered relocation operations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased text-white`}
        style={{ backgroundColor: "#0A0A0A" }}
      >
        {/* Background gradient orbs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-60 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #ADFF47 0%, transparent 70%)", filter: "blur(80px)" }}
          />
          <div
            className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #7FFF00 0%, transparent 70%)", filter: "blur(80px)" }}
          />
          <div
            className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #1a3a00 0%, transparent 70%)", filter: "blur(100px)" }}
          />
        </div>

        <Toaster position="bottom-right" theme="dark" />
        <div className="flex min-h-screen">
          <Nav />
          <main className="flex-1 p-4 md:p-7 pt-16 md:pt-7 overflow-auto min-w-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
