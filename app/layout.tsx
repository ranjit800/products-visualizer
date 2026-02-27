import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";

import { Footer, Header } from "@/components/layout";
import { Providers } from "@/app/providers";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { LOCALE_COOKIE_KEY } from "@/components/i18n/I18nProvider";

/* ── PWA + SEO Metadata ── */
export const metadata: Metadata = {
  title: {
    default: "Visualizer — Product Configurator",
    template: "%s | Visualizer",
  },
  description:
    "Browse, configure, and preview furniture products in 3D. AR preview on mobile. Save and share your configuration.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Visualizer",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
  openGraph: {
    title: "Visualizer — Product Configurator",
    description: "Configure furniture in 3D with AR preview and shareable links.",
    type: "website",
    siteName: "Visualizer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visualizer",
    description: "3D product configurator with AR preview.",
  },
  keywords: ["furniture", "3D configurator", "AR preview", "product visualizer"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_KEY)?.value;
  const initialLocale: Locale =
    cookieLocale === "en" || cookieLocale === "hi" ? cookieLocale : DEFAULT_LOCALE;

  return (
    <html lang={initialLocale} className="h-full">
      <body className="min-h-full bg-zinc-50 font-sans text-slate-900 antialiased dark:bg-black dark:text-slate-50">
        <Providers initialLocale={initialLocale}>
          <div className="min-h-dvh">
            <Header />
            {children}
            <Footer />
          </div>
          <ServiceWorkerRegistrar />
        </Providers>
      </body>
    </html>
  );
}
