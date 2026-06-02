import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import EmptyState from "../components/EmptyState";
import { useToast } from "../hooks/useToast";
import { formatPrice } from "../utils/format";
import {
  getFavorites,
  mergeItemsIntoCart,
  saveFavorites,
} from "../utils/storage";

export default function Liked() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = () => setFavorites(getFavorites());

  useEffect(() => {
    loadFavorites();
    window.addEventListener("favoritesChanged", loadFavorites);
    return () => window.removeEventListener("favoritesChanged", loadFavorites);
  }, []);

  const handleRemoveFavorite = (id) => {
    const next = favorites.filter((pill) => pill.id !== id);
    saveFavorites(next);
    setFavorites(next);
    showToast("Удалено из избранного");
  };

  const handleMoveToCart = () => {
    if (favorites.length === 0) return;
    mergeItemsIntoCart(favorites);
    saveFavorites([]);
    setFavorites([]);
    showToast("Все товары добавлены в корзину");
  };

  return (
    <div className="bg-[#F9F9F9] py-10 min-h-screen">
      <div className="container">
        <BackButton />

        <h1 className="text-3xl font-bold text-[#144F24] mb-6 text-center">
          Избранное
        </h1>

        {favorites.length === 0 ? (
          <EmptyState
            title="Список избранного пуст"
            description="Нажимайте на сердечко у товаров, чтобы сохранить их здесь"
            action={
              <Link
                to="/"
                className="mt-6 inline-block bg-mainColor text-white py-2 px-6 rounded-full font-medium hover:bg-[#248c41]"
              >
                В каталог
              </Link>
            }
          />
        ) : (
          <div className="mt-6 max-w-3xl mx-auto">
            {favorites.map((pill) => (
              <article
                key={pill.id}
                className="bg-white shadow-md rounded-xl p-6 mb-4 flex items-center gap-4"
              >
                <img
                  className="w-20 h-20 object-contain shrink-0"
                  src={pill.image}
                  alt={pill.name}
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${pill.id}`}
                    className="text-lg font-medium text-[#144F24] truncate block hover:text-mainColor"
                  >
                    {pill.name}
                  </Link>
                  <p className="text-sm text-gray-500">{formatPrice(pill.price)}</p>
                  <p className="text-sm text-gray-500">{pill.manufacturer}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFavorite(pill.id)}
                  className="text-gray-400 hover:text-red-500 text-xl shrink-0"
                  aria-label="Удалить из избранного"
                >
                  ✖
                </button>
              </article>
            ))}
            <button
              type="button"
              onClick={handleMoveToCart}
              className="w-full bg-mainColor text-white py-3 rounded-full font-medium hover:bg-[#248c41] transition-colors"
            >
              Добавить всё в корзину
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
