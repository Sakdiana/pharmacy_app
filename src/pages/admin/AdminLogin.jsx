import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isAdminLoggedIn, loginAdmin } from "../../utils/adminAuth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      navigate("/admin");
    } else {
      setError("Неверный пароль администратора");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#144F24] text-center mb-2">
          Вход в админ-панель
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Управление каталогом лекарств
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-pass" className="text-sm text-gray-600 block mb-1">
              Пароль
            </label>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-mainColor outline-none"
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#144F24] text-white py-3 rounded-lg font-medium hover:bg-[#0d3a18]"
          >
            Войти
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Демо-пароль: <code className="text-gray-600">admin123</code>
        </p>

        <Link
          to="/"
          className="block text-center mt-4 text-mainColor text-sm hover:underline"
        >
          ← На главную
        </Link>
      </div>
    </div>
  );
}
