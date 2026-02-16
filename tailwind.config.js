import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAW Landing",
  description: "Simple segmented landing page for users and instructors"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
