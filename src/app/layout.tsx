import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { ClinicProvider } from "@/context/ClinicContext";
import "./globals.css";

/** Cairo — clear Arabic UI font used widely on Arabic websites. */
const clinicFont = Cairo({
  variable: "--font-clinic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "العيادة — نساء وتوليد",
  description: "متابعة المريضات بسهولة لعيادة النساء والتوليد",
  applicationName: "العيادة",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "العيادة",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${clinicFont.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <ClinicProvider>{children}</ClinicProvider>
      </body>
    </html>
  );
}
