import { Outlet } from "react-router-dom";
import TheHeader from "./TheHeader";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <TheHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
