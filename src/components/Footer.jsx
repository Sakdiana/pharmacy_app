import { Link } from "react-router-dom";
import { isAdminLoggedIn } from "../utils/adminAuth";

export default function Footer() {
  const year = new Date().getFullYear();
  const admin = isAdminLoggedIn();

  return (
    <footer className="bg-mainColor py-9 mt-auto">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-white text-sm">
          <p>© {year} Онлайн-аптека. Все права защищены.</p>
          <span className="hidden sm:inline opacity-50">|</span>
          <Link
            to={admin ? "/admin" : "/admin/login"}
            className="hover:underline opacity-90"
          >
            {admin ? "Админ-панель" : "Вход для администратора"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
