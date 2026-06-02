import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  EMPTY_PRODUCT,
  getNextProductId,
  getProductById,
  loadCatalog,
  normalizeProduct,
  saveCatalog,
} from "../../services/catalog";
import { useToast } from "../../hooks/useToast";

const FIELDS = [
  { key: "name", label: "Название *", type: "text", required: true },
  { key: "price", label: "Цена (сом) *", type: "number", required: true, min: 0 },
  { key: "manufacturer", label: "Производитель *", type: "text", required: true },
  { key: "image", label: "URL фото *", type: "url", required: true },
  { key: "category", label: "Категория", type: "text" },
  { key: "form", label: "Форма выпуска", type: "text", placeholder: "Таблетки, 500 мг" },
  { key: "country", label: "Страна производства", type: "text" },
  {
    key: "expirationDate",
    label: "Срок годности *",
    type: "date",
    required: true,
  },
];

const TEXTAREAS = [
  { key: "purpose", label: "Назначение (для чего) *", rows: 2, required: true },
  { key: "description", label: "Подробное описание *", rows: 4, required: true },
  { key: "composition", label: "Состав", rows: 2 },
  { key: "dosage", label: "Способ применения и дозировка", rows: 3 },
  { key: "contraindications", label: "Противопоказания", rows: 3 },
  { key: "sideEffects", label: "Побочные действия", rows: 2 },
  { key: "storage", label: "Условия хранения", rows: 2 },
];

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ ...EMPTY_PRODUCT, inStock: true });
  const [loading, setLoading] = useState(isEdit);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    getProductById(id).then((product) => {
      if (product) {
        setForm({ ...EMPTY_PRODUCT, ...product });
        setImagePreview(product.image);
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "image") setImagePreview(value);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Файл слишком большой (макс. 2 МБ)", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      update("image", dataUrl);
      setImagePreview(dataUrl);
      showToast("Фото загружено");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const catalog = await loadCatalog();
    let nextCatalog;

    if (isEdit) {
      const productId = Number(id);
      nextCatalog = catalog.map((p) =>
        p.id === productId ? normalizeProduct(form, productId) : p
      );
    } else {
      const newId = getNextProductId(catalog);
      nextCatalog = [...catalog, normalizeProduct(form, newId)];
    }

    saveCatalog(nextCatalog);
    showToast(isEdit ? "Товар обновлён" : "Товар добавлен");
    navigate("/admin");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/admin" className="text-mainColor text-sm hover:underline mb-4 inline-block">
        ← К списку товаров
      </Link>

      <h1 className="text-2xl font-bold text-[#144F24] mb-6">
        {isEdit ? "Редактировать лекарство" : "Добавить лекарство"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#144F24]">Основные данные</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {FIELDS.map((field) => (
              <div
                key={field.key}
                className={field.key === "image" ? "sm:col-span-2" : ""}
              >
                <label className="text-sm text-gray-600 block mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) =>
                    update(
                      field.key,
                      field.type === "number" ? e.target.value : e.target.value
                    )
                  }
                  required={field.required}
                  min={field.min}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-mainColor outline-none"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Или загрузить фото с компьютера
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="text-sm"
            />
          </div>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Превью"
              className="w-32 h-32 object-contain border rounded-lg bg-gray-50"
            />
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => update("inStock", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">В наличии</span>
          </label>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#144F24]">Описание для страницы товара</h2>

          {TEXTAREAS.map((field) => (
            <div key={field.key}>
              <label className="text-sm text-gray-600 block mb-1">
                {field.label}
              </label>
              <textarea
                value={form[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                required={field.required}
                rows={field.rows}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-mainColor outline-none resize-y"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-3 bg-mainColor text-white rounded-lg font-medium hover:bg-[#248c41]"
          >
            {isEdit ? "Сохранить изменения" : "Добавить в каталог"}
          </button>
          <Link
            to="/admin"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}
