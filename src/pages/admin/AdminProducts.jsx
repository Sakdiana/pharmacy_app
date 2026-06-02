import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate, formatPrice } from "../../utils/format";
import {
  invalidateCatalogCache,
  loadCatalog,
  saveCatalog,
} from "../../services/catalog";
import { useToast } from "../../hooks/useToast";

export default function AdminProducts() {
  const { products, loading, error } = useProducts();
  const { showToast } = useToast();

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Удалить «${name}» из каталога?`)) return;

    const catalog = await loadCatalog();
    const next = catalog.filter((p) => p.id !== id);
    saveCatalog(next);
    showToast("Товар удалён");
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Сбросить каталог к исходному из файла? Все изменения админки будут потеряны."
      )
    ) {
      return;
    }
    localStorage.removeItem("pharmacy_catalog");
    invalidateCatalogCache();
    window.location.reload();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[#144F24]">Каталог лекарств</h1>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Сбросить каталог
          </button>
          <Link
            to="/admin/products/new"
            className="px-4 py-2 bg-mainColor text-white rounded-lg text-sm font-medium hover:bg-[#248c41]"
          >
            + Добавить лекарство
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4 font-medium">Фото</th>
                <th className="p-4 font-medium">Название</th>
                <th className="p-4 font-medium">Производитель</th>
                <th className="p-4 font-medium">Цена</th>
                <th className="p-4 font-medium">Срок годности</th>
                <th className="p-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={p.image}
                      alt=""
                      className="w-14 h-14 object-contain rounded bg-gray-50"
                    />
                  </td>
                  <td className="p-4 font-medium text-[#144F24]">
                    <Link
                      to={`/product/${p.id}`}
                      className="hover:text-mainColor"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-600">{p.manufacturer}</td>
                  <td className="p-4 font-medium">{formatPrice(p.price)}</td>
                  <td className="p-4 text-gray-600">
                    {formatDate(p.expirationDate)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                      >
                        Изменить
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <p className="p-8 text-center text-gray-500">Каталог пуст</p>
        )}
      </div>
    </div>
  );
}
