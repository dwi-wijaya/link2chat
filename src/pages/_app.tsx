import "@/styles/globals.css";
import "@/styles/css/fa.min.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" enableSystem={false}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
