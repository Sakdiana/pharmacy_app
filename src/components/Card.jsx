import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToCart, isFavorite, toggleFavorite } from "../utils/storage";
import { formatPrice } from "../utils/format";
import { useToast } from "../hooks/useToast";

export default function Card({ pill }) {
  const [liked, setLiked] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const sync = () => setLiked(isFavorite(pill.id));
    sync();
    window.addEventListener("favoritesChanged", sync);
    return () => window.removeEventListener("favoritesChanged", sync);
  }, [pill.id]);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(pill);
    setLiked(next);
    showToast(next ? "Добавлено в избранное" : "Удалено из избранного");
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(pill);
    showToast(`${pill.name} добавлен в корзину`);
  };

  return (
    <article className="card__item shadow-md max-w-[272px] w-full p-5 flex flex-col bg-white rounded-xl group">
      <div className="liked__btn flex justify-end relative z-10">
        <button
          type="button"
          onClick={handleLike}
          aria-label={liked ? "Убрать из избранного" : "В избранное"}
        >
          <img
            src={liked ? "/svg/likedRedBtn.svg" : "/svg/likedBtn.svg"}
            alt=""
            width={28}
            height={28}
            loading="lazy"
          />
        </button>
      </div>

      <Link to={`/product/${pill.id}`} className="flex flex-col flex-1">
        <div className="pillImg flex justify-center flex-1">
          <img
            className="w-56 h-40 object-contain group-hover:scale-105 transition-transform"
            src={pill.image}
            alt={pill.name}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="name mt-4">
          <h3 className="text-lg font-medium text-start group-hover:text-mainColor transition-colors">
            {pill.name}
          </h3>
          {pill.category && (
            <p className="text-xs text-mainColor mt-1">{pill.category}</p>
          )}
          <p className="text-sm text-gray-400 mt-2">
            {pill.manufacturer}
          </p>
        </div>

        <div className="price mt-4">
          <p className="text-2xl font-bold text-start text-[#144F24]">
            {formatPrice(pill.price)}
          </p>
        </div>

        <span className="text-sm text-mainColor mt-2 inline-block">
          Подробнее →
        </span>
      </Link>

      <div className="btn w-full mt-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={pill.inStock === false}
          className="w-full px-4 py-2 bg-mainColor text-white font-semibold rounded-full hover:bg-[#248c41] transition-colors disabled:opacity-50"
        >
          В корзину
        </button>
      </div>
    </article>
  );
}
