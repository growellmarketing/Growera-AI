import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalPilot AI — Multi-Tenant AI Business Management SaaS",
  description: "Manage multi-location Google Business Profiles, automate empathetic AI review replies, monitor customer sentiment, and boost local SEO reputation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
