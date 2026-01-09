// ProductModal.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const emptyForm = {
  name: "",
  categoryId: "",
  subCategoryId: "",
  brandId: "",
  abv: "",
  volumeMl: "",
  description: "",
  price: "",
  isFeatured: false,
  isActive: true,
  imageUrl: null, // will hold File when user selects new image
};

// ✅ supports edit image from: initialValues.image.url OR initialValues.imageUrl
const getExistingImageUrl = (v) => {
  if (!v) return "";
  if (typeof v.imageUrl === "string" && v.imageUrl) return v.imageUrl; // sometimes backend returns string
  if (v?.image?.url) return v.image.url; // your case
  if (typeof v.image === "string" && v.image) return v.image; // fallback
  return "";
};

export default function ProductModal({
  open,
  onClose,
  title = "Add Product",
  initialValues,
  onSubmit,
  loading = false,
  categories = [],
  subcategories = [],
  brands = [],
  onCategoryChange, // function(categoryId)
}) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(initialValues || {}),
  }));

  // ✅ show existing image on edit
  const [imagePreview, setImagePreview] = useState(() =>
    getExistingImageUrl(initialValues)
  );
  const [objectUrl, setObjectUrl] = useState(null); // to cleanup URL.createObjectURL

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...(initialValues || {}) });
      setImagePreview(getExistingImageUrl(initialValues));

      // cleanup any previous object url
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }

      const initialCatId = initialValues?.categoryId ?? "";
      if (initialCatId && typeof onCategoryChange === "function")
        onCategoryChange(initialCatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues]);

  // ✅ cleanup on unmount
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const onChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "categoryId") {
      setForm((prev) => ({ ...prev, categoryId: value, subCategoryId: "" }));
      if (typeof onCategoryChange === "function") await onCategoryChange(value);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    setForm((p) => ({ ...p, imageUrl: file }));

    // cleanup old object url
    if (objectUrl) URL.revokeObjectURL(objectUrl);

    if (file) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      setImagePreview(url);
    } else {
      setObjectUrl(null);
      setImagePreview(getExistingImageUrl(initialValues));
    }
  };

  const removeImage = () => {
    // remove selected new file (keep existing edit image visible)
    setForm((p) => ({ ...p, imageUrl: null }));

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(null);

    setImagePreview(getExistingImageUrl(initialValues));
  };

  const buildFormData = (f) => {
    const fd = new FormData();

    fd.append("name", f.name || "");
    fd.append("categoryId", f.categoryId || "");
    fd.append("subCategoryId", f.subCategoryId || "");
    fd.append("brandId", f.brandId || "");
    fd.append("description", f.description || "");

    fd.append("abv", String(Number(f.abv)));
    fd.append("volumeMl", String(Number(f.volumeMl)));
    fd.append("price", String(Number(f.price)));

    fd.append("isFeatured", String(!!f.isFeatured));
    fd.append("isActive", String(!!f.isActive));

    // ✅ MUST match backend: upload.single("imageUrl")
    // ✅ append File object
    if (f.imageUrl instanceof File) fd.append("imageUrl", f.imageUrl);

    return fd;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Product name is required");
    if (!form.categoryId.trim()) return toast.error("Category is required");
    if (!form.subCategoryId.trim())
      return toast.error("SubCategory is required");
    if (!form.brandId.trim()) return toast.error("Brand is required");
    if (form.abv === "" || Number.isNaN(Number(form.abv)))
      return toast.error("ABV is required");
    if (form.volumeMl === "" || Number.isNaN(Number(form.volumeMl)))
      return toast.error("Volume (ml) is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (form.price === "" || Number.isNaN(Number(form.price)))
      return toast.error("Price is required");

    const fd = buildFormData(form);

    for (const [key, value] of fd.entries()) console.log(key, value);

    await onSubmit(fd);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mx-auto flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-zinc-950 text-white shadow-2xl">
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/90 px-6 py-4 backdrop-blur">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Fill details and save to the catalog
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
          <form id="product-form" onSubmit={submit} className="grid gap-6">
            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
              <Field label="Product Name" required>
                <Input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="e.g. Johnnie Walker Black Label"
                  required
                />
              </Field>

              <Field label="Price ($)" required>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={onChange}
                  placeholder="44.00"
                  required
                />
              </Field>

              <Field label="Category" required>
                <SelectNoSearch
                  name="categoryId"
                  value={form.categoryId}
                  onChange={onChange}
                  placeholder="Select category"
                  options={categories}
                  required
                />
              </Field>

              <Field label="SubCategory" required>
                <SelectNoSearch
                  name="subCategoryId"
                  value={form.subCategoryId}
                  onChange={onChange}
                  placeholder={
                    form.categoryId
                      ? "Select subcategory"
                      : "Select category first"
                  }
                  options={subcategories}
                  required
                  disabled={!form.categoryId || subcategories.length === 0}
                />
              </Field>

              <Field label="Brand" required>
                <SelectNoSearch
                  name="brandId"
                  value={form.brandId}
                  onChange={onChange}
                  placeholder="Select brand"
                  options={brands}
                  required
                />
              </Field>

              <Field label="ABV" required>
                <Input
                  name="abv"
                  type="number"
                  step="0.1"
                  value={form.abv}
                  onChange={onChange}
                  placeholder="40"
                  required
                />
              </Field>

              <Field label="Volume (ml)" required>
                <select
                  name="volumeMl"
                  value={form.volumeMl}
                  onChange={onChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="">Select volume</option>
                  <option value="250">250</option>
                  <option value="500">500</option>
                  <option value="750">750</option>
                  <option value="1000">1000</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-200">
                      Product Image
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Upload jpg/png/webp
                    </div>
                  </div>

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/10"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <label className="mt-4 grid cursor-pointer place-items-center rounded-2xl border border-dashed border-white/15 bg-black/30 p-6 text-center hover:bg-black/40">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                  <div className="text-sm text-gray-200">Click to upload</div>
                  <div className="mt-1 text-xs text-gray-500">
                    or choose a file from your device
                  </div>
                </label>

                <div className="mt-4 h-48 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-xs text-gray-500">
                      No image selected
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Field label="Description" required>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    rows={12}
                    required
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Write a short product description..."
                  />
                </Field>
              </div>
            </div>
          </form>
        </div>

        {/* footer */}
        <div className="sticky bottom-0 z-10 border-t border-white/10 bg-zinc-950/90 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={onChange}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-200">Featured</span>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={onChange}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-200">Published</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-60"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                form="product-form"
                disabled={loading}
                className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectNoSearch({
  name,
  value,
  onChange,
  placeholder,
  options,
  required,
  disabled,
}) {
  const getKey = (opt) =>
    opt?._id ?? opt?.id ?? opt?.slug ?? opt?.name ?? String(opt);
  const getLabel = (opt) => opt?.name ?? opt?.slug ?? String(opt);
  const getValue = (opt) =>
    opt?._id ?? opt?.id ?? opt?.slug ?? opt?.name ?? String(opt);

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={getKey(opt)} value={getValue(opt)}>
          {getLabel(opt)}
        </option>
      ))}
    </select>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-200">
          {label} {required ? <span className="text-red-300">*</span> : null}
        </span>
        {hint ? <span className="text-xs text-gray-500">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-white/20 ${className}`}
    />
  );
}
