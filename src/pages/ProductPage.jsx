import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import LoadingSpinner from "../components/LoadingSpinner";
import { useProduct } from "../hooks/useProduct";
import { addToCart, isFavorite, toggleFavorite } from "../utils/storage";
import { formatDate, formatPrice, isExpired, isExpiringSoon } from "../utils/format";
import { useToast } from "../hooks/useToast";

function InfoBlock({ title, children }) {
  if (!children) return null;
  return (
    <section className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#144F24] mb-2">{title}</h2>
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
        {children}
      </p>
    </section>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { showToast } = useToast();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!product) return;
    const sync = () => setLiked(isFavorite(product.id));
    sync();
    window.addEventListener("favoritesChanged", sync);
    return () => window.removeEventListener("favoritesChanged", sync);
  }, [product]);

  if (loading) return <LoadingSpinner label="Загрузка товара..." />;

  if (error || !product) {
    return (
      <div className="bg-[#F9F9F9] py-10 min-h-screen">
        <div className="container text-center">
          <p className="text-red-500 mb-4">{error || "Товар не найден"}</p>
          <Link to="/" className="text-mainColor hover:underline">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const expired = isExpired(product.expirationDate);
  const expiringSoon = isExpiringSoon(product.expirationDate);

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} добавлен в корзину`);
  };

  const handleLike = () => {
    const next = toggleFavorite(product);
    setLiked(next);
    showToast(next ? "Добавлено в избранное" : "Удалено из избранного");
  };

  return (
    <div className="bg-[#F9F9F9] py-10 min-h-screen">
      <div className="container max-w-5xl">
        <BackButton />

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center">
            <div className="w-full flex justify-end gap-2 mb-2">
              <button
                type="button"
                onClick={handleLike}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Избранное"
              >
                <img
                  src={liked ? "/svg/likedRedBtn.svg" : "/svg/likedBtn.svg"}
                  alt=""
                  width={32}
                  height={32}
                />
              </button>
            </div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-80 object-contain"
            />
            {product.category && (
              <span className="mt-4 text-xs font-medium bg-green-100 text-[#144F24] px-3 py-1 rounded-full">
                {product.category}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#144F24]">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.manufacturer}</p>
            {product.form && (
              <p className="text-sm text-gray-600 mt-1">Форма: {product.form}</p>
            )}

            <p className="text-4xl font-bold text-mainColor mt-6">
              {formatPrice(product.price)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {!product.inStock && (
                <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                  Нет в наличии
                </span>
              )}
              {expired && (
                <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  Срок годности истёк
                </span>
              )}
              {!expired && expiringSoon && (
                <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  Скоро истекает срок годности
                </span>
              )}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <dt className="text-gray-500">Срок годности</dt>
                <dd className="font-medium text-[#144F24]">
                  {formatDate(product.expirationDate)}
                </dd>
              </div>
              {product.country && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <dt className="text-gray-500">Страна</dt>
                  <dd className="font-medium">{product.country}</dd>
                </div>
              )}
            </dl>

            {product.purpose && (
              <p className="mt-6 text-gray-700 leading-relaxed bg-white rounded-xl p-4 shadow-sm">
                <span className="font-semibold text-[#144F24]">Назначение: </span>
                {product.purpose}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 min-w-[200px] px-6 py-3 bg-mainColor text-white font-semibold rounded-full hover:bg-[#248c41] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                В корзину
              </button>
              <Link
                to="/cart"
                className="px-6 py-3 border-2 border-mainColor text-mainColor font-semibold rounded-full hover:bg-green-50 text-center"
              >
                Перейти в корзину
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <InfoBlock title="Описание">{product.description}</InfoBlock>
          <InfoBlock title="Состав">{product.composition}</InfoBlock>
          <InfoBlock title="Способ применения и дозировка">{product.dosage}</InfoBlock>
          <InfoBlock title="Противопоказания">{product.contraindications}</InfoBlock>
          <InfoBlock title="Побочные действия">{product.sideEffects}</InfoBlock>
          <InfoBlock title="Условия хранения">{product.storage}</InfoBlock>
        </div>

        <p className="mt-8 text-xs text-gray-400 text-center max-w-2xl mx-auto">
          Информация носит справочный характер. Перед применением проконсультируйтесь
          с врачом или фармацевтом.
        </p>
      </div>
    </div>
  );
}
