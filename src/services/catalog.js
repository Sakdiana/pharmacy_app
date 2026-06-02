const CATALOG_KEY = "pharmacy_catalog";

let cache = null;
let loadPromise = null;

function readStoredCatalog() {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function fetchBaseCatalog() {
  const res = await fetch("/data/products.json");
  if (!res.ok) throw new Error("Не удалось загрузить каталог");
  return res.json();
}

export function invalidateCatalogCache() {
  cache = null;
  loadPromise = null;
}

export function dispatchProductsChanged() {
  window.dispatchEvent(new Event("productsChanged"));
}

export async function loadCatalog() {
  if (cache) return cache;
  if (!loadPromise) {
    loadPromise = (async () => {
      const stored = readStoredCatalog();
      const data = stored ?? (await fetchBaseCatalog());
      cache = data;
      return data;
    })();
  }
  return loadPromise;
}

export function getCatalogSync() {
  return cache ?? readStoredCatalog() ?? [];
}

export function saveCatalog(products) {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
  cache = products;
  loadPromise = Promise.resolve(products);
  dispatchProductsChanged();
}

export async function getProductById(id) {
  const catalog = await loadCatalog();
  return catalog.find((p) => p.id === Number(id)) ?? null;
}

export function getNextProductId(products) {
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
  return maxId + 1;
}

export const EMPTY_PRODUCT = {
  name: "",
  price: "",
  manufacturer: "",
  image: "",
  form: "",
  country: "",
  expirationDate: "",
  inStock: true,
  purpose: "",
  description: "",
  composition: "",
  dosage: "",
  contraindications: "",
  sideEffects: "",
  storage: "",
  category: "",
};

export function normalizeProduct(raw, id) {
  return {
    ...EMPTY_PRODUCT,
    ...raw,
    id,
    price: Number(raw.price) || 0,
    inStock: raw.inStock !== false && raw.inStock !== "false",
  };
}
