import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Narx Top - Avto narxini taxmin qilish o'yini",
  description: "O'zbekiston avtomobil bozoridagi haqiqiy narxlarni taxmin qiling - bot bilan yoki do'stlaringiz bilan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
