import { filterProducts, useProducts } from "../hooks/useProducts";
import LoadingSpinner from "./LoadingSpinner";
import ProductGrid from "./ProductGrid";

export default function SearchResults({ searchTerm }) {
  const { products, loading, error } = useProducts();
  const filtered = filterProducts(products, searchTerm);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return <p className="text-red-500 text-center py-12">{error}</p>;
  }

  return (
    <section className="mb-12" aria-label="Результаты поиска">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#144F24]">
          Результаты поиска: «{searchTerm}»
        </h2>
        <ProductGrid
          products={filtered}
          emptyMessage={`По запросу «${searchTerm}» ничего не найдено`}
        />
      </div>
    </section>
  );
}
