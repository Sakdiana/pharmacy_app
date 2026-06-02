import { useProducts } from "../hooks/useProducts";
import LoadingSpinner from "./LoadingSpinner";
import ProductGrid from "./ProductGrid";

export default function Cards() {
  const { products, loading, error } = useProducts();

  if (loading) return <LoadingSpinner label="Загружаем каталог..." />;
  if (error) {
    return (
      <p className="text-red-500 text-center py-12" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section aria-label="Каталог товаров">
      <div className="container">
        <h2 className="text-2xl font-bold text-[#144F24] mb-8 text-center">
          Популярные товары
        </h2>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
