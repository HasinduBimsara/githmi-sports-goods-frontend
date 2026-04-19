export default function getCart() {
  let cart = localStorage.getItem("cart");

  if (cart == null) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    return [];
  }

  cart = JSON.parse(cart).map((item) => normalizeProduct(item, item.quantity ?? 1, item.size ?? "", item.color ?? ""));
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
}

function notifyCartUpdate(cart) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("cart:updated", {
      detail: {
        count: cart.reduce(
          (total, item) => total + Number(item?.quantity ?? 0),
          0,
        ),
      },
    }),
  );
}

function getItemId(product) {
  return product?.productId ?? product?.id ?? product?._id;
}

function getItemImage(product) {
  if (product?.image) {
    return product.image;
  }

  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images[0];
  }

  return "https://placehold.co/150x150";
}

function normalizeProduct(product, qty, size = "", color = "") {
  const itemId = getItemId(product);
  const price = Number(product?.price ?? 0);
  const labeledPrice = Number(product?.labeledPrice ?? price);

  const cartItemId = `${itemId}${size ? '-' + size : ''}${color ? '-' + color : ''}`;

  return {
    cartItemId,
    id: itemId,
    productId: itemId,
    name: product?.name ?? "Product",
    altNames: Array.isArray(product?.altNames) ? product.altNames : [],
    price,
    labeledPrice,
    image: getItemImage(product),
    quantity: qty,
    size,
    color,
  };
}

export function addToCart(product, qty, size = "", color = "") {
  const itemId = getItemId(product);

  if (!itemId || qty === 0) {
    return getCart();
  }

  const cartItemId = `${itemId}${size ? '-' + size : ''}${color ? '-' + color : ''}`;
  let cart = getCart();
  const productIndex = cart.findIndex((item) => (item.cartItemId || getItemId(item)) === cartItemId);

  if (productIndex === -1) {
    if (qty > 0) {
      cart.push(normalizeProduct(product, qty, size, color));
    }
  } else {
    cart[productIndex].quantity += qty;

    if (cart[productIndex].quantity <= 0) {
      cart = cart.filter((item) => (item.cartItemId || getItemId(item)) !== cartItemId);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  notifyCartUpdate(cart);
  return cart;
}

export function removeFromCart(cartItemId) {
  let cart = getCart();
  cart = cart.filter((item) => (item.cartItemId || getItemId(item)) !== cartItemId);
  localStorage.setItem("cart", JSON.stringify(cart));
  notifyCartUpdate(cart);
  return cart;
}

export function getTotal() {
  let cart = getCart();
  let total = 0;
  cart.forEach((product) => {
    total += product.price * product.quantity;
  });
  return total;
}

export function getTotalForLabelledPrice() {
  let cart = getCart();
  let total = 0;
  cart.forEach((product) => {
    total += (product.labeledPrice ?? product.price) * product.quantity;
  });
  return total;
}
