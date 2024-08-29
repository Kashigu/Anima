

import Head from "next/head";
import Header from "../components/Header";
import ErrorBoundary from "../components/ErrorBoundaries";
import "../globals.css"; 

export const metadata = {
  title: "Anima",
  description: "Anima is a web application that allows you to search and see your favourite anime.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Head>
        <title>Anima</title>
      </Head>
      <body>
        <Header />
        <ErrorBoundary>
          <main>{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
