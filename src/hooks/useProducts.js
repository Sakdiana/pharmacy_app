import { useCallback, useEffect, useState } from "react";
import { loadCatalog } from "../services/catalog";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);
    loadCatalog()
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("productsChanged", refresh);
    return () => window.removeEventListener("productsChanged", refresh);
  }, [refresh]);

  return { products, loading, error, refresh };
}

export function filterProducts(products, query) {
  const term = query.trim().toLowerCase();
  if (!term) return products;

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.manufacturer,
      product.purpose,
      product.description,
      product.category,
      product.composition,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(term);
  });
}
