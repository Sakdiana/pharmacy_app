import { Link, Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../utils/adminAuth";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#144F24] text-white shadow-md">
        <div className="container flex items-center justify-between py-4 gap-4 flex-wrap">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-bold text-lg">
              Админ-панель
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link to="/admin" className="hover:text-green-300">
                Товары
              </Link>
              <Link to="/admin/products/new" className="hover:text-green-300">
                Добавить
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-green-300">
              На сайт
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
}
