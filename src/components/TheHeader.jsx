import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Menu from "./Menu";
import SearchResults from "./SearchResults";

const TheHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);
  const [hasItemsInCart, setHasItemsInCart] = useState(false);
  const [userExist, setUserExist] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const isUserExist = () => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  };

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const updateFavorites = () => {
    const favoritePills = JSON.parse(localStorage.getItem("favorites")) || [];
    setHasFavorites(favoritePills.length > 0);
  };

  const updateCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setHasItemsInCart(cartItems.length > 0);
  };

  useEffect(() => {
    const currentUser = isUserExist();
    setUserExist(currentUser);
    updateFavorites();
    updateCart();

    window.addEventListener("favoritesChanged", updateFavorites);
    window.addEventListener("cartChanged", updateCart);

    return () => {
      window.removeEventListener("favoritesChanged", updateFavorites);
      window.removeEventListener("cartChanged", updateCart);
    };
  }, []);

  const toggleFavorite = (pill) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.some((fav) => fav.id === pill.id)) {
      favorites = favorites.filter((fav) => fav.id !== pill.id);
    } else {
      favorites.push(pill);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    window.dispatchEvent(new Event("favoritesChanged"));
  };

  return (
    <header className="shadow-md">
      <div className="container">
        <div className="headerItems flex items-center justify-between py-12 max-sm:flex-wrap">
          <Link to={"/"} className="logo">
            <img src="/svg/logo.png" alt="" />
          </Link>

          <div className="input__search w-[60%] flex items-center gap-3 border border-mainColor rounded-xl px-8 py-3 max-md:py-1">
            <input
              className="w-full outline-none"
              type="text"
              placeholder="Поиск"
              value={searchInput}
              onChange={(e) => {
                const value = e.target.value;
                setSearchInput(value);

                if (value.trim() === "") {
                  setSearchParams({});
                  navigate("/");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (searchInput.trim()) {
                    setSearchParams({ search: searchInput.trim() });
                    navigate(
                      `/?search=${encodeURIComponent(searchInput.trim())}`
                    );
                  }
                }
              }}
            />

            <img
              src="/svg/search.svg"
              alt=""
              className="cursor-pointer"
              onClick={() => {
                if (searchInput.trim()) {
                  setSearchParams({ search: searchInput.trim() });
                  navigate(
                    `/?search=${encodeURIComponent(searchInput.trim())}`
                  );
                }
              }}
            />
          </div>

          <div className="icons flex items-center gap-10 max-[1029px]:hidden">
            <Link
              to={"/liked"}
              className="liked flex flex-col items-center gap-1"
            >
              <img
                src={hasFavorites ? "/svg/likedRed.svg" : "/svg/liked.svg"}
                alt="Favorites"
              />
              <p className="font-medium text-md hover:text-mainColor">
                Избранное
              </p>
            </Link>

            <Link
              to={"/cart"}
              className="liked flex flex-col items-center gap-1"
            >
              <img src="/svg/cart.svg" alt="" />
              <p className="font-medium text-md hover:text-mainColor">
                Корзина
              </p>
              {hasItemsInCart && (
                <span className="absolute top-10 right-[200px] bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  !
                </span>
              )}
            </Link>

            {userExist ? (
              <Link
                to={"/userPage"}
                className="liked flex flex-col items-center gap-1"
              >
                <img src="/svg/login.svg" alt="" />
                <p className="font-medium text-black text-md hover:text-mainColor">
                  {userExist.name}
                </p>
              </Link>
            ) : (
              <Link
                to={"/login"}
                className="liked flex flex-col items-center gap-1"
              >
                <img src="/svg/login.svg" alt="" />
                <p className="font-medium text-md hover:text-mainColor">
                  Войти
                </p>
              </Link>
            )}
          </div>

          <div onClick={handleOpen} className="menu hidden max-[1029px]:block">
            <img className="w-10" src="/svg/menu.png" alt="" />
          </div>
        </div>
      </div>

      {isOpen && <Menu handleOpen={handleOpen} />}
    </header>
  );
};

export default TheHeader;
