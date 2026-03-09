import axios from "axios";

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=Product";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getProductListFromResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

function getProductFromResponse(data) {
  if (data?.product) {
    return data.product;
  }

  if (data?.data && !Array.isArray(data.data)) {
    return data.data;
  }

  return data;
}

export function normalizeProduct(product) {
  if (!product) {
    return null;
  }

  const productId = product.productId ?? product.id ?? "";
  const price = toNumber(product.price);
  const labeledPrice = toNumber(product.labeledPrice, price);
  const stock = toNumber(product.stock);
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : product.image
        ? [product.image]
        : [FALLBACK_IMAGE];

  return {
    ...product,
    id: productId,
    productId,
    name: product.name ?? "Product",
    altNames: Array.isArray(product.altNames) ? product.altNames.filter(Boolean) : [],
    price,
    labeledPrice,
    stock,
    description: product.description ?? "Product details will be available soon.",
    images,
    image: product.image ?? images[0] ?? FALLBACK_IMAGE,
  };
}

export async function fetchProducts() {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product`);
  return getProductListFromResponse(response.data)
    .map(normalizeProduct)
    .filter(Boolean);
}

export async function fetchProductById(productId) {
  let detailError = null;

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`,
    );
    const product = normalizeProduct(getProductFromResponse(response.data));

    if (product?.productId) {
      return product;
    }
  } catch (error) {
    detailError = error;
  }

  const products = await fetchProducts();
  const matchingProduct =
    products.find(
      (product) =>
        String(product.productId) === String(productId) ||
        String(product.id) === String(productId),
    ) ?? null;

  if (matchingProduct) {
    return matchingProduct;
  }

  if (detailError) {
    throw detailError;
  }

  return null;
}
