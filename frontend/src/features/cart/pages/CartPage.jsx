/**
 * ============================================================================
 * CartPage.jsx - 장바구니 페이지 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 사용자의 장바구니 상품 목록 표시 및 관리
 * - 상품 수량 조절, 선택 삭제, 전체 삭제 기능 제공
 * - 선택한 상품들을 결제 페이지로 전달
 *
 * 【주요 기능】
 * 1. **로그인 체크**: 비로그인 사용자는 로그인 페이지로 리다이렉트
 * 2. **장바구니 관리**:
 *    - 상품 수량 증가/감소 (최소 1개, 최대 99개)
 *    - 개별 삭제 / 선택 삭제 / 전체 삭제
 *    - 체크박스로 결제할 상품 선택
 * 3. **가격 계산**:
 *    - 단가 × 수량 = 상품별 소계
 *    - 선택 상품들의 총합 계산
 * 4. **결제 진행**:
 *    - 선택 상품 데이터를 localStorage에 저장
 *    - /checkout 페이지로 이동
 *
 * 【성능 최적화】
 * - useCallback: 가격 계산 함수 메모이제이션
 * - useMemo: 전체선택 여부, 선택상품, 총액 계산 캐싱
 * - 이유: cart/selected 상태 변경 시에만 재계산
 *
 * 【localStorage 동기화】
 * - saveCart() 함수는 state 업데이트 + localStorage 저장 동시 수행
 * - StorageEvent 발생 → Header의 장바구니 뱃지 실시간 업데이트
 *
 * 【상태 구조】
 * - cart: 장바구니 아이템 배열 [{ id, product, qty, size }, ...]
 * - selected: 선택 상태 객체 { "item1": true, "item2": false, ... }
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLogin } from "features/auth/slice/authSlice.js";
import storage from "../../../utils/storage.js";
import "./CartPage.css";

/**
 * CartPage 함수형 컴포넌트
 *
 * @returns {JSX.Element} 장바구니 페이지 UI
 */
export default function CartPage() {
  // ============================================================================
  // Hooks & State
  // ============================================================================
  const navigate = useNavigate();

  /** cart - 장바구니 아이템 목록 (localStorage에서 로드) */
  const [cart, setCart] = useState([]);

  /** selected - 각 아이템의 선택 상태 { id: boolean } */
  const [selected, setSelected] = useState({});

  /** isLogin - 로그인 여부 (Redux state) */
  const isLogin = useSelector(selectIsLogin);

  // ============================================================================
  // useEffect: 로그인 체크 및 초기 데이터 로드
  // ============================================================================

  /**
   * 로그인 여부 확인
   *
   * @description
   * 비로그인 사용자가 장바구니에 접근하면 로그인 페이지로 리다이렉트합니다.
   * Redux의 selectIsLogin으로 로그인 상태를 확인합니다.
   */
  useEffect(() => {
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
  }, [isLogin, navigate]);

  /**
   * localStorage에서 장바구니 데이터 로드
   *
   * @description
   * 컴포넌트 마운트 시 실행됩니다.
   * 1. localStorage에서 장바구니 데이터를 가져옵니다.
   * 2. 모든 아이템을 기본적으로 선택 상태(true)로 초기화합니다.
   * 3. JSON 파싱 오류 시 빈 배열로 초기화합니다.
   */
  useEffect(() => {
    try {
      const saved = storage.get("cart", []);
      setCart(saved);

      // 모든 아이템을 기본 선택 상태로 설정
      const initSel = {};
      saved.forEach((i) => {
        initSel[i.id] = true; // 모두 체크된 상태
      });
      setSelected(initSel);
    } catch {
      // localStorage 오류 시 초기화
      setCart([]);
      setSelected({});
    }
  }, []); // 마운트 시 1회만 실행

  // ============================================================================
  // Cart Operations (장바구니 조작 함수)
  // ============================================================================

  /**
   * saveCart - 장바구니 저장 (state + localStorage + 이벤트 발생)
   *
   * @description
   * 장바구니가 변경될 때마다 호출됩니다.
   * 1. React state 업데이트 (리렌더링 트리거)
   * 2. localStorage 저장 (브라우저 새로고침 대비)
   * 3. StorageEvent 발생 (Header의 장바구니 뱃지 실시간 업데이트)
   *
   * @param {Array} next - 새로운 장바구니 배열
   *
   * @example
   * // 상품 1개 삭제
   * const next = cart.filter(i => i.id !== "product123");
   * saveCart(next);
   * // → state 업데이트 + localStorage 저장 + Header 뱃지 업데이트
   */
  const saveCart = (next) => {
    setCart(next); // React state 업데이트
    storage.set("cart", next); // localStorage 저장
    // Header 컴포넌트의 storage 이벤트 리스너가 이 이벤트를 감지
    window.dispatchEvent(new StorageEvent("storage", { key: "cart", newValue: JSON.stringify(next) }));
  };

  // ============================================================================
  // Selection (체크박스 선택 관리)
  // ============================================================================

  /**
   * toggleOne - 개별 아이템 선택/해제 토글
   *
   * @param {string} id - 아이템 ID
   */
  const toggleOne = (id) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  /**
   * allChecked - 전체 선택 여부 (useMemo로 캐싱)
   *
   * @description
   * 모든 아이템이 선택되어 있으면 true, 하나라도 해제되어 있으면 false.
   * cart나 selected 변경 시에만 재계산합니다.
   *
   * @type {boolean}
   */
  const allChecked = useMemo(
    () => cart.length > 0 && cart.every((i) => selected[i.id]),
    [cart, selected]
  );

  /**
   * toggleAll - 전체 선택/해제 토글
   *
   * @description
   * allChecked가 true면 모두 해제, false면 모두 선택합니다.
   */
  const toggleAll = () => {
    const next = {};
    cart.forEach((i) => {
      next[i.id] = !allChecked; // 현재 전체선택 상태의 반대로 설정
    });
    setSelected(next);
  };

  // ============================================================================
  // Price Calculation (가격 계산 함수)
  // ============================================================================

  /**
   * parsePrice - 가격 문자열 파싱 (useCallback으로 메모이제이션)
   *
   * @description
   * "₩50,000" 형태의 문자열을 숫자 50000으로 변환합니다.
   * 숫자가 아닌 모든 문자를 제거합니다.
   *
   * @param {string|number} val - 가격 값
   * @returns {number} 파싱된 숫자
   *
   * @example
   * parsePrice("₩50,000") // → 50000
   * parsePrice(50000) // → 50000
   * parsePrice("invalid") // → 0
   */
  const parsePrice = useCallback((val) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    return Number(String(val).replace(/[^\d]/g, "")) || 0;
  }, []);

  /**
   * unitPrice - 상품의 단가 추출
   *
   * @param {Object} p - product 객체
   * @returns {number} 단가
   */
  const unitPrice = useCallback((p) => parsePrice(p?.price), [parsePrice]);

  /**
   * linePrice - 상품별 소계 계산 (단가 × 수량)
   *
   * @param {Object} i - 장바구니 아이템
   * @returns {number} 소계
   *
   * @example
   * // 단가 50,000원 × 수량 3개 = 150,000원
   * linePrice({ product: { price: 50000 }, qty: 3 }) // → 150000
   */
  const linePrice = useCallback((i) => unitPrice(i.product) * Number(i.qty || 1), [unitPrice]);

  // ✅ 수량 변경 함수들
  const inc = (id) => {
    const next = cart.map((i) =>
      i.id === id
        ? { ...i, qty: Math.min(99, (Number(i.qty) || 1) + 1) }
        : i
    );
    saveCart(next);
  };

  const dec = (id) => {
    const next = cart.map((i) =>
      i.id === id
        ? { ...i, qty: Math.max(1, (Number(i.qty) || 1) - 1) }
        : i
    );
    saveCart(next);
  };

  const changeQty = (id, v) => {
    const n = Math.max(1, Math.min(99, Number(v) || 1));
    const next = cart.map((i) =>
      i.id === id ? { ...i, qty: n } : i
    );
    saveCart(next);
  };

  // ✅ 삭제
  const removeOne = (id) => {
    const next = cart.filter((i) => i.id !== id);
    saveCart(next);
    setSelected((prev) => {
      const p = { ...prev };
      delete p[id];
      return p;
    });
  };

  const removeSelected = () => {
    const next = cart.filter((i) => !selected[i.id]);
    saveCart(next);
    const ns = {};
    next.forEach((i) => {
      ns[i.id] = true;
    });
    setSelected(ns);
  };

  const clearAll = () => {
    saveCart([]);
    setSelected({});
  };

  // ✅ 선택 상품 필터
  const selectedItems = useMemo(
    () => cart.filter((i) => selected[i.id]),
    [cart, selected]
  );

  // ✅ 총합 계산
  const totalPrice = useMemo(
    () => selectedItems.reduce((s, i) => s + linePrice(i), 0),
    [selectedItems, linePrice]
  );

  // ✅ 결제 페이지 이동
  const proceed = () => {
    if (selectedItems.length === 0) {
      alert("결제할 상품을 선택해주세요.");
      return;
    }

    const payload = selectedItems.map((i) => ({
      id: i.id,
      name: i.product?.name || "",
      image: i.product?.image || i.product?.img || "",
      price: parsePrice(i.product?.price),
      qty: Number(i.qty || 1),
      size: i.size || "",
    }));

    if (payload.length === 0) {
      alert("결제할 상품 데이터가 올바르지 않습니다.");
      return;
    }

    storage.set("cartCheckout", payload);
    navigate("/checkout", { state: { fromCart: true } });
  };

  return (
    <div className="cart-wrap">
      <h1 className="cart-title">장바구니</h1>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>장바구니가 비어 있습니다.</p>
          <Link to="/" className="btn">
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-head">
            <label className="chk">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
              />
              <span>전체선택</span>
            </label>
            <div className="cart-head-actions">
              <button className="btn" onClick={removeSelected}>
                선택삭제
              </button>
              <button className="btn-danger" onClick={clearAll}>
                전체삭제
              </button>
            </div>
          </div>

          <div className="cart-list">
            {cart.map((i) => {
              const unit = unitPrice(i.product);
              const sub = linePrice(i);
              const imgSrc = i.product?.image || i.product?.img;

              return (
                <div className="cart-item" key={i.id}>
                  <label className="chk">
                    <input
                      type="checkbox"
                      checked={!!selected[i.id]}
                      onChange={() => toggleOne(i.id)}
                    />
                  </label>

                  <img
                    className="cart-img"
                    src={imgSrc || "/images/placeholder.png"}
                    alt={i.product?.name}
                  />

                  <div className="cart-info">
                    <div className="cart-name">
                      {i.product?.name || "상품"}
                    </div>
                    <div className="cart-meta">사이즈: {i.size}</div>
                    <div className="cart-meta">
                      단가: ₩{unit.toLocaleString()}
                    </div>
                  </div>

                  <div className="cart-qty">
                    <button onClick={() => dec(i.id)}>-</button>
                    <input
                      value={i.qty}
                      onChange={(e) => changeQty(i.id, e.target.value)}
                    />
                    <button onClick={() => inc(i.id)}>+</button>
                  </div>

                  <div className="cart-sub">
                    ₩{sub.toLocaleString()}
                  </div>

                  <button
                    className="btn-danger"
                    onClick={() => removeOne(i.id)}
                  >
                    삭제
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="cart-sum-row">
              <span>선택 상품 금액</span>
              <b>₩{totalPrice.toLocaleString()}</b>
            </div>
            <div className="cart-actions">
              <Link to="/" className="btn">
                쇼핑 계속하기
              </Link>
              <button className="pay-btn" onClick={proceed}>
                선택 상품 결제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
