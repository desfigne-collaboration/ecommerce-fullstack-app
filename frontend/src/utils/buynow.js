// src/utils/buynow.js
import storage from "./storage.js";

export function buyNow(product, qty = 1, push, option = {}) {
  const payload = {
    items: [
      {
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        qty: Number(qty) || 1,
        image: product.image || "",
        option: { ...option }, // ← 사이즈 등 옵션 포함
      },
    ],
    createdAt: Date.now(),
    from: "brand",
    mode: "buynow",
  };

  storage.set("pendingCheckout", payload);

  if (typeof push === "function") push("/order/checkout?mode=buynow");
  else window.location.hash = "#/order/checkout?mode=buynow";
}
