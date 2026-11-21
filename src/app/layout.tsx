import type { Metadata, Viewport } from "next";
import { PwaProvider } from "@/components/PwaProvider";
import { ClinicProvider } from "@/context/ClinicContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "العيادة — نساء وتوليد",
  description: "متابعة المريضات بسهولة لعيادة النساء والتوليد",
  applicationName: "العيادة",
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "العيادة",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f4f7fc",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className="min-h-full font-sans antialiased">
        <PwaProvider>
          <ClinicProvider>{children}</ClinicProvider>
        </PwaProvider>
      </body>
    </html>
  );
}
