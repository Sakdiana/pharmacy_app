const CART_KEY = "cart";
const FAVORITES_KEY = "favorites";
const CURRENT_USER_KEY = "currentUser";
const USERS_KEY = "registeredUsers";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function dispatchCartChanged() {
  window.dispatchEvent(new Event("cartChanged"));
}

export function dispatchFavoritesChanged() {
  window.dispatchEvent(new Event("favoritesChanged"));
}

export function getCart() {
  return readJson(CART_KEY, []);
}

export function saveCart(cart) {
  writeJson(CART_KEY, cart);
  dispatchCartChanged();
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + (item.count ?? 1), 0);
}

export function addToCart(pill) {
  const cart = getCart();
  const index = cart.findIndex((item) => item.id === pill.id);

  if (index !== -1) {
    cart[index] = { ...cart[index], count: (cart[index].count ?? 1) + 1 };
  } else {
    cart.push({ ...pill, count: 1 });
  }

  saveCart(cart);
}

export function mergeItemsIntoCart(items) {
  const cart = getCart();

  items.forEach((pill) => {
    const index = cart.findIndex((item) => item.id === pill.id);
    if (index !== -1) {
      cart[index] = { ...cart[index], count: (cart[index].count ?? 1) + 1 };
    } else {
      cart.push({ ...pill, count: 1 });
    }
  });

  saveCart(cart);
}

export function getFavorites() {
  return readJson(FAVORITES_KEY, []);
}

export function saveFavorites(favorites) {
  writeJson(FAVORITES_KEY, favorites);
  dispatchFavoritesChanged();
}

export function isFavorite(id) {
  return getFavorites().some((item) => item.id === id);
}

export function toggleFavorite(pill) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.id === pill.id);

  const next = exists
    ? favorites.filter((item) => item.id !== pill.id)
    : [...favorites, pill];

  saveFavorites(next);
  return !exists;
}

export function getCurrentUser() {
  return readJson(CURRENT_USER_KEY, null);
}

export function setCurrentUser(user) {
  if (user) {
    writeJson(CURRENT_USER_KEY, user);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  window.dispatchEvent(new Event("userChanged"));
}

export function getRegisteredUsers() {
  return readJson(USERS_KEY, []);
}

export function saveRegisteredUsers(users) {
  writeJson(USERS_KEY, users);
}

export function appendPurchase(user, items) {
  const purchases = [...(user.purchases || []), ...items];
  const updated = { ...user, purchases };
  setCurrentUser(updated);

  const registered = getRegisteredUsers();
  const index = registered.findIndex(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );
  if (index !== -1) {
    const next = [...registered];
    next[index] = updated;
    saveRegisteredUsers(next);
  }

  return updated;
}
