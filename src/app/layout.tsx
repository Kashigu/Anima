

import Head from "next/head";
import Header from "../components/Header";
import ErrorBoundary from "../components/ErrorBoundaries";
import "../globals.css"; 
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

export const metadata = {
  title: "Anima",
  description: "Anima is a web application that allows you to search and see your favourite anime.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-custom-blue-dark">
      <Head>
        <title>Anima</title>
      </Head>
      <body style={{ height: 'auto' }}>
        <Header />
        <ErrorBoundary>
          <main className="bg-custom-blue-dark">{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
