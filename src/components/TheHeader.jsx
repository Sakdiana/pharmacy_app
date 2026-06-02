import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Menu from "./Menu";
import { getCartCount, getCurrentUser, getFavorites } from "../utils/storage";

export default function TheHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || ""
  );

  const refreshCounts = () => {
    setFavoritesCount(getFavorites().length);
    setCartCount(getCartCount());
    setUser(getCurrentUser());
  };

  useEffect(() => {
    refreshCounts();

    window.addEventListener("favoritesChanged", refreshCounts);
    window.addEventListener("cartChanged", refreshCounts);
    window.addEventListener("userChanged", refreshCounts);

    return () => {
      window.removeEventListener("favoritesChanged", refreshCounts);
      window.removeEventListener("cartChanged", refreshCounts);
      window.removeEventListener("userChanged", refreshCounts);
    };
  }, []);

  useEffect(() => {
    setSearchInput(searchParams.get("search") || "");
  }, [searchParams]);

  const handleOpen = () => setIsOpen((prev) => !prev);

  const runSearch = () => {
    const value = searchInput.trim();
    if (!value) {
      setSearchParams({});
      navigate("/");
      return;
    }
    setSearchParams({ search: value });
    navigate(`/?search=${encodeURIComponent(value)}`);
  };

  return (
    <header className="shadow-md bg-white sticky top-0 z-40">
      <div className="container">
        <div className="headerItems flex items-center justify-between py-6 gap-4 max-sm:flex-wrap">
          <Link to="/" className="logo flex items-center gap-2 shrink-0">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-mainColor text-white font-bold text-lg"
              aria-hidden="true"
            >
              +
            </span>
            <span className="text-xl font-bold text-[#144F24]">Аптека</span>
          </Link>

          <div className="input__search flex-1 flex items-center gap-3 border border-mainColor rounded-xl px-4 py-2 min-w-0">
            <input
              className="w-full outline-none text-sm"
              type="search"
              placeholder="Поиск лекарств..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
              aria-label="Поиск"
            />
            <button type="button" onClick={runSearch} aria-label="Искать">
              <img src="/svg/search.svg" alt="" width={22} height={22} />
            </button>
          </div>

          <nav className="icons flex items-center gap-8 max-[1029px]:hidden" aria-label="Основное меню">
            <Link to="/liked" className="relative flex flex-col items-center gap-1">
              <img
                src={favoritesCount > 0 ? "/svg/likedRed.svg" : "/svg/liked.svg"}
                alt=""
                width={28}
                height={28}
              />
              <span className="font-medium text-sm hover:text-mainColor">Избранное</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative flex flex-col items-center gap-1">
              <img src="/svg/cart.svg" alt="" width={28} height={28} />
              <span className="font-medium text-sm hover:text-mainColor">Корзина</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link to="/userPage" className="flex flex-col items-center gap-1 max-w-[100px]">
                <img src="/svg/login.svg" alt="" width={28} height={28} />
                <span className="font-medium text-sm text-black hover:text-mainColor truncate w-full text-center">
                  {user.name}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="flex flex-col items-center gap-1">
                <img src="/svg/login.svg" alt="" width={28} height={28} />
                <span className="font-medium text-sm hover:text-mainColor">Войти</span>
              </Link>
            )}
          </nav>

          <button
            type="button"
            onClick={handleOpen}
            className="menu hidden max-[1029px]:block p-2"
            aria-label="Открыть меню"
            aria-expanded={isOpen}
          >
            <span className="flex flex-col gap-1.5 w-7">
              <span className="h-0.5 w-full bg-[#144F24] rounded" />
              <span className="h-0.5 w-full bg-[#144F24] rounded" />
              <span className="h-0.5 w-full bg-[#144F24] rounded" />
            </span>
          </button>
        </div>
      </div>

      {isOpen && <Menu handleOpen={handleOpen} user={user} />}
    </header>
  );
}
