import storage from "../utils/storage.js";

const KEY = "cart";

const read = () => {
  return storage.get(KEY, []);
};
const write = (list) => storage.set(KEY, list);

// 카트 아이템 키 생성
export const cartItemKey = (item = {}) => (
  (item.id ?? item.productId ?? "").toString() ||
  `${item.name || ""}::${item.image || ""}::${item.price || ""}`
);

// 카트에서 특정 아이템 찾기
export const findInCart = (item) => {
  const k = cartItemKey(item);
  const cart = read();
  return cart.find((x) => cartItemKey(x) === k);
};

// 카트에 아이템 추가
export const addToCart = (item) => {
  const list = read();
  const k = cartItemKey(item);
  const existing = list.find((x) => cartItemKey(x) === k);

  let next;
  if (existing) {
    // 이미 존재하면 수량 증가
    next = list.map((x) =>
      cartItemKey(x) === k
        ? { ...x, quantity: (x.quantity || 1) + (item.quantity || 1) }
        : x
    );
  } else {
    // 새 아이템 추가
    next = [...list, { ...item, __key: k, quantity: item.quantity || 1 }];
  }

  write(next);
  // 동기화 이벤트 (현재 탭에서도 받게 수동 디스패치)
  window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: JSON.stringify(next) }));

  return next;
};

// 카트에서 아이템 제거
export const removeFromCart = (item) => {
  const k = cartItemKey(item);
  const next = read().filter((x) => cartItemKey(x) !== k);
  write(next);
  window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: JSON.stringify(next) }));
  return next;
};

// 카트 수량 업데이트
export const updateCartQuantity = (item, quantity) => {
  const k = cartItemKey(item);
  const next = read().map((x) =>
    cartItemKey(x) === k ? { ...x, quantity: Math.max(1, quantity) } : x
  );
  write(next);
  window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: JSON.stringify(next) }));
  return next;
};

// 카트 비우기
export const clearCart = () => {
  write([]);
  window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: "[]" }));
};

// 카트 조회
export const getCart = () => read();
