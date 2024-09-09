import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Link2Chat</title>
        <meta name="description" content="Link2Chat simplifies communication! Easily generate a WhatsApp link and connect with anyone instantly." />
        <meta name="keywords" content="WhatsApp, WhatsApp link generator, communication, connect, chat, online tools" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Dwi" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://link2chat.vercel.app/" />
        <meta property="og:title" content="Link2Chat - Generate WhatsApp Link Instantly" />
        <meta property="og:description" content="Simplify your communication with Link2Chat! Generate a WhatsApp link and connect with others easily." />
        <meta property="og:image" content="https://link2chat.vercel.app/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://link2chat.vercel.app/" />
        <meta property="twitter:title" content="Link2Chat - Generate WhatsApp Link Instantly" />
        <meta property="twitter:description" content="Simplify your communication with Link2Chat! Generate a WhatsApp link and connect with others easily." />
        <meta property="twitter:image" content="https://link2chat.vercel.app/twitter-image.jpg" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://link2chat.vercel.app/" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Mobile-friendly settings */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
