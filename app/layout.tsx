import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BAGS",
  description: "Funding the Future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* font-sans will resolve to OpenRunde via your CSS vars */}
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}