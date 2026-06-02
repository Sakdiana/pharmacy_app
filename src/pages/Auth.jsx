import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import {
  getRegisteredUsers,
  saveRegisteredUsers,
  setCurrentUser,
} from "../utils/storage";

export default function Auth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 4) {
      setError("Пароль должен быть не короче 4 символов");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/data/users.json");
      const data = await res.json();
      const demoUsers = data.users || [];
      const registered = getRegisteredUsers();
      const emailNorm = email.trim().toLowerCase();

      const exists = [...demoUsers, ...registered].some(
        (u) => u.email.toLowerCase() === emailNorm
      );

      if (exists) {
        setError("Пользователь с таким email уже существует");
        return;
      }

      const newUser = {
        name: name.trim() || "Пользователь",
        email: emailNorm,
        password,
        purchases: [],
      };

      saveRegisteredUsers([...registered, newUser]);
      setCurrentUser(newUser);
      showToast("Регистрация успешна!");
      navigate("/userPage");
    } catch {
      setError("Не удалось завершить регистрацию");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F9F9F9] py-10 min-h-screen">
      <div className="container max-w-lg mx-auto">
        <Link
          to="/login"
          className="flex items-center text-mainColor font-medium mb-6 hover:underline"
        >
          ← Назад ко входу
        </Link>

        <h1 className="text-3xl font-bold text-[#144F24] mb-6 text-center">
          Регистрация
        </h1>

        <form
          onSubmit={handleRegister}
          className="bg-white shadow-md rounded-xl p-6 flex flex-col"
        >
          <label className="text-sm text-gray-600 mb-1" htmlFor="name">
            Имя
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:border-mainColor outline-none"
            required
          />

          <label className="text-sm text-gray-600 mb-1" htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:border-mainColor outline-none"
            required
          />

          <label className="text-sm text-gray-600 mb-1" htmlFor="reg-password">
            Пароль
          </label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:border-mainColor outline-none"
            required
            minLength={4}
          />

          <label className="text-sm text-gray-600 mb-1" htmlFor="confirm">
            Повторите пароль
          </label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:border-mainColor outline-none"
            required
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
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-500 text-sm">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-mainColor font-medium hover:underline">
            Войдите
          </Link>
        </p>
      </div>
    </div>
  );
}
