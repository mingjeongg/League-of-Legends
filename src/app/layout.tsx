import type { Metadata } from "next";

import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "League Of Legend App",
  description: "Information of League of Legend ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="bg-black">
        <header className="flex mx-auto w-full justify-center items-center bg-gray-800 text-white py-4  ">
          <nav className="w-full flex justify-around">
            <Link href={"/"}>홈</Link>
            <Link href={"/champions"}>챔피언 목록</Link>
            <Link href={"/items"}>아이템 목록</Link>
            <Link href={"/rotation"}>챔피언 로테이션</Link>
          </nav>
        </header>
        <main> {children} </main>
        <footer className="bg-gray-800 text-white text-center py-4">
          [Your Product Name] is not endorsed by Riot Games and does not reflect
          the views or opinions of Riot Games or anyone officially involved in
          producing or managing Riot Games properties. Riot Games and all
          associated properties are trademarks or registered trademarks of Riot
          Games, Inc.
        </footer>
      </body>
    </html>
  );
}
