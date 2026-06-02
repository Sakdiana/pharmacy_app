import Card from "./Card";

export default function ProductGrid({ products, emptyMessage = "Товары не найдены" }) {
  if (products.length === 0) {
    return (
      <p className="text-gray-500 text-center py-12">{emptyMessage}</p>
    );
  }

  return (
    <div className="cards__items flex items-stretch justify-center gap-4 flex-wrap">
      {products.map((pill) => (
        <Card key={pill.id} pill={pill} />
      ))}
    </div>
  );
}
