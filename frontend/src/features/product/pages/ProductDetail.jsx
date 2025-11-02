/**
 * ============================================================================
 * ProductDetail.jsx - 상품 상세 페이지 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 개별 상품의 상세 정보 표시 (이미지, 이름, 가격, 설명)
 * - 사이즈/수량 선택 및 장바구니 담기 기능
 * - 찜하기(위시리스트) 토글 기능
 * - 즉시 구매 기능 (결제 페이지로 이동)
 *
 * 【주요 기능】
 * 1. **상품 데이터 로드**: location.state 또는 localStorage에서 복원
 * 2. **찜하기 토글**: 하트 버튼 클릭 → 위시리스트 추가/제거
 * 3. **장바구니 담기**: 사이즈 선택 필수, localStorage에 저장
 * 4. **즉시 구매**: 사이즈/수량 선택 후 결제 페이지로 바로 이동
 * 5. **수량 조절**: 최소 1개, 최대 99개 제한
 *
 * 【상품 데이터 로드 전략】
 * 우선순위 1: location.state.product (ProductCard에서 navigate로 전달)
 * 우선순위 2: localStorage의 lastProduct (새로고침 대비)
 * 이유: URL 파라미터만으로는 전체 상품 정보를 알 수 없음
 *
 * 【localStorage 동기화】
 * - 장바구니/찜하기 변경 시 StorageEvent 발생
 * - Header의 뱃지 카운트가 실시간 업데이트됨
 *
 * 【라우팅】
 * - 경로: /products/:id
 * - 장바구니 담기 후 → /cart 페이지로 이동
 * - 즉시 구매 클릭 → /checkout 페이지로 이동
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import storage from "../../../utils/storage.js";
import "./ProductDetail.css";

/**
 * ProductDetail 함수형 컴포넌트
 *
 * @returns {JSX.Element} 상품 상세 페이지 UI
 */
export default function ProductDetail() {
  // ============================================================================
  // Hooks & State
  // ============================================================================
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams(); // URL 파라미터 (현재 미사용, 상품 데이터는 state로 전달됨)

  /** fromState - navigate()로 전달된 상품 데이터 */
  const fromState = location.state?.product || null;

  /** size - 선택된 사이즈 (필수 선택) */
  const [size, setSize] = useState("");

  /** qty - 선택된 수량 (1~99) */
  const [qty, setQty] = useState(1);

  /** isWished - 찜 여부 (위시리스트에 포함되어 있는지) */
  const [isWished, setIsWished] = useState(false);

  // ============================================================================
  // Product Data (상품 데이터 로드)
  // ============================================================================
  /**
   * product - 현재 상품 정보 (useMemo로 캐싱)
   *
   * @description
   * 우선순위에 따라 상품 데이터를 로드합니다:
   * 1. location.state.product (ProductCard에서 navigate로 전달)
   * 2. localStorage의 lastProduct (새로고침 대비)
   *
   * @type {Object|null}
   */
  const product = useMemo(() => {
    // 1순위: navigate state로 전달된 데이터
    if (fromState && fromState.id) return fromState;

    // 2순위: localStorage에 저장된 마지막 조회 상품
    try {
      return storage.get("lastProduct", null);
    } catch {
      return null;
    }
  }, [fromState]);

  const clampQty = (v) => (v < 1 ? 1 : v > 99 ? 99 : v);

  // 숫자 가격
  const normalizedPrice =
    typeof product?.price === "string"
      ? Number(String(product.price).replace(/[^\d]/g, "")) || 0
      : Number(product?.price || 0);

  // 찜 상태 체크
  useEffect(() => {
    if (!product?.id) return;
    try {
      const wishlist = storage.get("wishlist", []);
      setIsWished(wishlist.some((w) => String(w.id) === String(product.id)));
    } catch {
      setIsWished(false);
    }
  }, [product]);

  const toggleWish = () => {
    if (!product) return;
    try {
      const wishlist = storage.get("wishlist", []);
      const i = wishlist.findIndex((w) => String(w.id) === String(product.id));

      let updatedWishlist;
      if (i >= 0) {
        // ✅ filter를 사용하여 새 배열 생성 (불변성 유지)
        updatedWishlist = wishlist.filter((w) => String(w.id) !== String(product.id));
        setIsWished(false);
      } else {
        // ✅ 스프레드 연산자로 새 배열 생성 (불변성 유지)
        updatedWishlist = [...wishlist, {
          id: product.id,
          name: product.name || "",
          image: product.image || product.img,
          price: normalizedPrice,
          addedAt: Date.now(),
        }];
        setIsWished(true);
      }

      storage.set("wishlist", updatedWishlist);
      window.dispatchEvent(new StorageEvent("storage", { key: "wishlist", newValue: JSON.stringify(updatedWishlist) }));
    } catch {}
  };

  // 장바구니 담기
  const addToCart = () => {
    if (!product) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }
    if (!size) {
      alert("사이즈를 선택해 주세요.");
      return;
    }
    try {
      const itemId = `${product.id}-${size}`;
      const cart = storage.get("cart", []);
      const idx = cart.findIndex((c) => c.id === itemId);
      if (idx >= 0) {
        const cur = Number(cart[idx].qty) || 1;
        const add = Number(qty) || 1;
        cart[idx].qty = Math.min(99, cur + add);
      } else {
        cart.push({
          id: itemId,
          product: {
            id: product.id,
            name: product.name || "",
            image: product.image || product.img,
            price: normalizedPrice,
          },
          size,
          qty: Number(qty) || 1,
        });
      }
      storage.set("cart", cart);
      window.dispatchEvent(new StorageEvent("storage", { key: "cart", newValue: JSON.stringify(cart) }));
      alert("장바구니에 담았습니다.");
    } catch (e) {
      console.error(e);
      alert("장바구니 처리 중 오류가 발생했습니다.");
    }
  };

  // 바로 주문 → Checkout으로 "주문 1건" 전달
  const goCheckout = () => {
    if (!product) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }
    if (!size) {
      alert("사이즈를 선택해 주세요.");
      return;
    }

    const payload = {
      product: {
        id: product.id,
        name: product.name || "",
        image: product.image || product.img,
        price: normalizedPrice,
      },
      size,
      qty: Number(qty),
    };

    // 혹시 대비해 로컬에도 저장
    storage.set("pendingOrder", payload);
    // 최근 상품도 유지
    storage.set("lastProduct", product);

    // ✅ Checkout으로 state로도 함께 전달
    navigate("/checkout", { state: { order: payload } });
  };

  if (!product) {
    return (
      <div className="product-detail-container">
        상품 정보를 찾을 수 없습니다. 목록에서 이미지를 클릭해 다시 들어와 주세요.
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <h1 className="product-detail-title">상품 상세</h1>

      <div className="product-detail-grid">
        <div>
          <img
            src={product.image || product.img}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div>
          <div className="product-name-section">
            <div className="product-name">{product.name || "상품명"}</div>

            <button
              onClick={toggleWish}
              className="wishlist-button"
              title={isWished ? "찜 취소" : "찜하기"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isWished ? "#ff4444" : "none"}>
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke={isWished ? "#ff4444" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="product-price">
            {normalizedPrice ? `₩${normalizedPrice.toLocaleString()}` : ""}
          </div>

          <div className="product-form-container">
            <label className="form-label">
              <span className="form-label-text">사이즈</span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="form-select"
              >
                <option value="">선택하세요</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </label>

            <label className="form-label">
              <span className="form-label-text">수량</span>
              <input
                type="number"
                min="1"
                max="99"
                value={qty}
                onChange={(e) => setQty(clampQty(Number(e.target.value)))}
                className="form-input"
              />
            </label>

            <div className="button-group">
              <button onClick={addToCart} className="cart-button">
                장바구니 담기
              </button>
              <button onClick={goCheckout} className="checkout-button">
                주문하기
              </button>
            </div>

            <Link to="/cart" className="cart-link">
              장바구니로 이동
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
