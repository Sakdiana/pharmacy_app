import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { getRegisteredUsers, setCurrentUser } from "../utils/storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/data/users.json");
      const data = await res.json();

      const demoUsers = data.users || [];
      const registered = getRegisteredUsers();
      const allUsers = [...demoUsers, ...registered];

      const user = allUsers.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (user) {
        setCurrentUser(user);
        showToast(`Добро пожаловать, ${user.name}!`);
        navigate("/userPage");
      } else {
        setError("Неверный email или пароль");
      }
    } catch {
      setError("Ошибка загрузки данных. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F9F9F9] py-10 min-h-screen">
      <div className="container max-w-lg mx-auto">
        <Link
          to="/"
          className="flex items-center text-mainColor font-medium mb-6 hover:underline"
        >
          ← На главную
        </Link>

        <h1 className="text-3xl font-bold text-[#144F24] mb-6 text-center">
          Вход в аккаунт
        </h1>

        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded-xl p-6 flex flex-col"
        >
          <label className="text-sm text-gray-600 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:border-mainColor outline-none"
            required
            autoComplete="email"
          />

          <label className="text-sm text-gray-600 mb-1" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:border-mainColor outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-red-500 text-sm mb-4" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-mainColor text-white font-medium rounded-md hover:bg-[#248c41] transition disabled:opacity-60"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-500 text-sm">
          Нет аккаунта?{" "}
          <Link to="/auth" className="text-mainColor font-medium hover:underline">
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
}
