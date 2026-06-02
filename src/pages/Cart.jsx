import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import EmptyState from "../components/EmptyState";
import { useToast } from "../hooks/useToast";
import { formatPrice } from "../utils/format";
import {
  appendPurchase,
  getCart,
  getCurrentUser,
  saveCart,
} from "../utils/storage";

export default function Cart() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState([]);

  const loadCart = () => {
    const stored = getCart().map((item) => ({
      ...item,
      count: item.count ?? 1,
    }));
    setCartItems(stored);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("cartChanged", loadCart);
    return () => window.removeEventListener("cartChanged", loadCart);
  }, []);

  const persist = (items) => {
    setCartItems(items);
    saveCart(items);
  };

  const handleIncrement = (id) => {
    persist(
      cartItems.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    persist(
      cartItems
        .map((item) =>
          item.id === id ? { ...item, count: item.count - 1 } : item
        )
        .filter((item) => item.count > 0)
    );
  };

  const handleRemoveItem = (id) => {
    persist(cartItems.filter((item) => item.id !== id));
    showToast("Товар удалён из корзины");
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.count,
    0
  );

  const handlePurchase = () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      showToast("Войдите в аккаунт для оформления заказа", "error");
      navigate("/login");
      return;
    }

    appendPurchase(currentUser, cartItems);
    saveCart([]);
    setCartItems([]);
    showToast("Заказ оформлен! Спасибо за покупку");
    navigate("/userPage");
  };

  return (
    <div className="bg-[#F9F9F9] py-10 min-h-screen">
      <div className="container">
        <BackButton />

        <h1 className="text-3xl font-bold text-[#144F24] mb-6 text-center">
          Корзина
        </h1>

        {cartItems.length === 0 ? (
          <EmptyState
            title="Ваша корзина пуста"
            description="Добавляйте товары с главной страницы или из избранного"
            action={
              <Link
                to="/"
                className="mt-6 inline-block bg-mainColor text-white py-2 px-6 rounded-full font-medium hover:bg-[#248c41]"
              >
                Перейти в каталог
              </Link>
            }
          />
        ) : (
          <div className="mt-6 max-w-3xl mx-auto">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="bg-white shadow-md rounded-xl p-6 mb-6 flex items-center gap-8 relative max-[480px]:flex-col max-[480px]:items-start"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute top-4 right-4 text-xl text-gray-400 hover:text-red-500"
                  aria-label="Удалить товар"
                >
                  ✖
                </button>

                <img
                  className="w-32 h-24 object-contain max-[480px]:mx-auto"
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-medium text-[#144F24]">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatPrice(item.price)} · {item.manufacturer}
                  </p>

                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm text-gray-500">Количество:</span>
                    <button
                      type="button"
                      onClick={() => handleDecrement(item.id)}
                      className="text-xl text-white rounded-lg px-3 py-1 bg-mainColor hover:bg-[#248c41]"
                      aria-label="Уменьшить"
                    >
                      −
                    </button>
                    <span className="font-medium min-w-[24px] text-center">
                      {item.count}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIncrement(item.id)}
                      className="text-xl text-white rounded-lg px-3 py-1 bg-mainColor hover:bg-[#248c41]"
                      aria-label="Увеличить"
                    >
                      +
                    </button>
                    <span className="ml-auto font-semibold text-[#144F24]">
                      {formatPrice(item.price * item.count)}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-xl font-bold text-[#144F24]">
                Итого: {formatPrice(totalPrice)}
              </p>
              <button
                type="button"
                onClick={handlePurchase}
                className="bg-mainColor text-white py-3 px-8 rounded-full mt-6 font-medium hover:bg-[#248c41] transition-colors"
              >
                Оформить заказ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
