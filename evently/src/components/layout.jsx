import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function Layout({ children }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-16 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}