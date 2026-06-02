import { Link } from "react-router-dom";
import { getCartCount, getFavorites } from "../utils/storage";
import { isAdminLoggedIn } from "../utils/adminAuth";

export default function Menu({ handleOpen, user }) {
  const favoritesCount = getFavorites().length;
  const cartCount = getCartCount();
  const admin = isAdminLoggedIn();

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm"
      onClick={handleOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Мобильное меню"
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-4/5 md:w-1/2 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleOpen}
          className="absolute top-3 right-3 text-xl text-[#144F24]"
          aria-label="Закрыть меню"
        >
          ✕
        </button>

        <ul className="flex flex-col items-center space-y-4 pt-4">
          <li>
            <Link onClick={handleOpen} to="/" className="nav-link">
              На главную
            </Link>
          </li>
          <li>
            <Link onClick={handleOpen} to="/liked" className="nav-link">
              Избранное {favoritesCount > 0 && `(${favoritesCount})`}
            </Link>
          </li>
          <li>
            <Link onClick={handleOpen} to="/cart" className="nav-link">
              Корзина {cartCount > 0 && `(${cartCount})`}
            </Link>
          </li>
          <li>
            {user ? (
              <Link onClick={handleOpen} to="/userPage" className="nav-link">
                {user.name}
              </Link>
            ) : (
              <Link onClick={handleOpen} to="/login" className="nav-link">
                Войти
              </Link>
            )}
          </li>
          <li>
            <Link
              onClick={handleOpen}
              to={admin ? "/admin" : "/admin/login"}
              className="nav-link text-gray-500"
            >
              {admin ? "Админ-панель" : "Админ"}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
