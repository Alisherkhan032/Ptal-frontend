'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar/Sidebar"; // Import Sidebar here
import { Providers } from "./Providers";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current path

  // Check if the current path is '/login' or '/signup'
  const shouldHideSidebar = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex w-screen h-screen bg-[#f9fafc] overflow-hidden">
            {/* Sidebar */}
            {!shouldHideSidebar && (
              <div className="w-[15.5rem] h-full">
                <Sidebar />
              </div>
            )}

            {/* Main Content */}
            <main
              className="flex-1 h-full bg-[#f9fafc] scrollbar-none overflow-auto gap-x-[1rem]"
              style={{
                marginLeft: shouldHideSidebar ? 0 : "1rem", // Add margin to create space
              }}
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
