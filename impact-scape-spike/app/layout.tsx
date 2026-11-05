import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Impact Scape",
  description: "Explore organizations working toward social and environmental impact.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
