import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { formatPrice } from "../utils/format";
import { getCurrentUser, setCurrentUser } from "../utils/storage";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = getCurrentUser();
    setUser(stored);

    const onUserChange = () => setUser(getCurrentUser());
    window.addEventListener("userChanged", onUserChange);
    return () => window.removeEventListener("userChanged", onUserChange);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  if (!user) {
    return (
      <div className="bg-[#F9F9F9] py-10 min-h-screen">
        <div className="container text-center">
          <p className="text-gray-500 mb-4">
            Вы не авторизованы. Войдите в аккаунт.
          </p>
          <Link
            to="/login"
            className="inline-block bg-mainColor text-white py-2 px-6 rounded-full"
          >
            Войти
          </Link>
        </div>
      </div>
    );
  }

  const purchases = user.purchases || [];

  return (
    <div className="bg-[#F9F9F9] py-10 min-h-screen">
      <div className="container">
        <BackButton />

        <div className="max-w-xl mx-auto mt-4 p-6 bg-white border rounded-2xl shadow-md">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-mainColor">
              Профиль
            </h1>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline shrink-0"
            >
              Выйти
            </button>
          </div>

          <dl className="space-y-3 mb-8">
            <div>
              <dt className="text-sm text-gray-500">Имя</dt>
              <dd className="font-medium text-[#144F24]">{user.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
          </dl>

          <h2 className="text-xl font-semibold text-mainColor mb-4">
            История заказов
          </h2>

          {purchases.length > 0 ? (
            <ul className="space-y-3">
              {purchases.map((item, index) => (
                <li
                  key={`${item.id}-${index}`}
                  className="flex justify-between gap-4 border-b border-gray-100 pb-3 text-sm"
                >
                  <span className="font-medium text-[#144F24]">{item.name}</span>
                  <span className="text-gray-600 shrink-0">
                    {item.count ?? 1} шт. · {formatPrice(item.price * (item.count ?? 1))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">
              Пока нет заказов.{" "}
              <Link to="/" className="text-mainColor hover:underline">
                Перейти в каталог
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
