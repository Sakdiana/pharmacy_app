import { useCallback, useEffect, useState } from "react";
import { getProductById } from "../services/catalog";

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getProductById(id)
      .then((data) => {
        if (!data) {
          setError("Товар не найден");
          setProduct(null);
        } else {
          setProduct(data);
          setError(null);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    refresh();
    window.addEventListener("productsChanged", refresh);
    return () => window.removeEventListener("productsChanged", refresh);
  }, [refresh]);

  return { product, loading, error };
}
