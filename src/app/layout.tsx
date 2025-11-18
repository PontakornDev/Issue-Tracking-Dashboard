import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Issue Tracking Dashboard",
  description: "Manage and track issues efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
