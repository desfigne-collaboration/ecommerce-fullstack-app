/**
 * ============================================================================
 * WishlistPage.jsx - 위시리스트 페이지 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 사용자가 찜한 상품 목록을 표시하고 관리하는 페이지
 * - localStorage 기반 위시리스트 데이터 관리
 * - 단건 삭제, 전체 삭제, 상세 페이지 이동 기능 제공
 *
 * 【주요 기능】
 * 1. **위시리스트 표시**: localStorage에서 찜한 상품 목록 로드 및 그리드 레이아웃 표시
 * 2. **실시간 동기화**: StorageEvent를 통한 다른 탭/컴포넌트와 동기화
 * 3. **단건 삭제**: 개별 상품 위시리스트에서 제거
 * 4. **전체 삭제**: 위시리스트 전체 비우기
 * 5. **상품 상세 이동**: 클릭 시 상품 상세 페이지로 이동
 *
 * 【localStorage 동기화 메커니즘】
 * - window.addEventListener("storage"): 다른 탭에서 변경 시 감지
 * - window.dispatchEvent(StorageEvent): 같은 탭 내 다른 컴포넌트에 알림
 * - Header의 하트 뱃지와 실시간 동기화
 *
 * 【데이터 구조】
 * localStorage["wishlist"] = [
 *   {
 *     id: "product123",
 *     name: "상품명",
 *     brand: "브랜드명",
 *     price: 50000,
 *     originalPrice: 70000,
 *     image: "이미지 URL"
 *   },
 *   ...
 * ]
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import storage from "../../../utils/storage.js";
import "./Wishlist.css";

/** localStorage 키 상수 */
const KEY = "wishlist";

/**
 * readWishlist - localStorage에서 위시리스트 데이터 읽기
 *
 * @description
 * 안전하게 localStorage에서 위시리스트를 읽어옵니다.
 * 파싱 오류 시 빈 배열을 반환합니다.
 *
 * @returns {Array} 위시리스트 상품 배열
 */
const readWishlist = () => {
  try {
    return storage.get(KEY, []);
  } catch {
    return [];
  }
};

/**
 * Wishlist 함수형 컴포넌트
 *
 * @returns {JSX.Element} 위시리스트 페이지 UI
 */
export default function Wishlist() {
  const navigate = useNavigate();

  /** items - 위시리스트 상품 배열 (localStorage에서 초기화) */
  const [items, setItems] = useState(() => readWishlist());

  /** count - 위시리스트 상품 개수 */
  const count = items.length;

  // ============================================================================
  // useEffect: StorageEvent 실시간 동기화
  // ============================================================================

  /**
   * storage 이벤트 리스너 등록
   *
   * @description
   * 다른 컴포넌트(예: ProductDetail의 WishButton)에서
   * 위시리스트를 변경하면 이 페이지도 즉시 반영됩니다.
   *
   * StorageEvent가 발생하면 localStorage를 다시 읽어 state를 업데이트합니다.
   */
  useEffect(() => {
    const onStorage = (e) => {
      if (!e || !e.key || e.key === "wishlist") {
        setItems(readWishlist());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // ============================================================================
  // Event Handlers (이벤트 핸들러)
  // ============================================================================

  /**
   * goDetail - 상품 상세 페이지로 이동
   *
   * @description
   * 위시리스트 카드를 클릭하면 해당 상품의 상세 페이지로 이동합니다.
   * lastProduct를 localStorage에 저장하여 새로고침 시에도 데이터 유지합니다.
   *
   * @param {Object} p - 상품 객체
   */
  const goDetail = (p) => {
    storage.set("lastProduct", p);
    navigate(`/product/${p.id}`, { product: p });
  };

  /**
   * removeOne - 위시리스트에서 단건 삭제
   *
   * @description
   * 특정 상품을 위시리스트에서 제거합니다.
   * 1. items 배열에서 필터링
   * 2. localStorage 업데이트
   * 3. StorageEvent 발행 (Header 뱃지 업데이트용)
   * 4. React state 업데이트
   *
   * @param {string} id - 삭제할 상품 ID
   */
  const removeOne = (id) => {
    const next = items.filter((it) => it.id !== id);
    storage.set(KEY, next);
    window.dispatchEvent(new StorageEvent("storage", { key: "wishlist", newValue: JSON.stringify(next) }));
    setItems(next);
  };

  /**
   * clearAll - 위시리스트 전체 삭제
   *
   * @description
   * 위시리스트의 모든 상품을 삭제합니다.
   * 사용자 확인 없이 즉시 삭제되므로 주의가 필요합니다.
   *
   * @todo 사용자 확인 대화상자 추가 고려
   */
  const clearAll = () => {
    storage.set(KEY, []);
    window.dispatchEvent(new StorageEvent("storage", { key: "wishlist", newValue: "[]" }));
    setItems([]);
  };

  /**
   * fmt - 가격 포맷팅 함수
   *
   * @description
   * 숫자나 문자열 가격을 한국 통화 형식으로 변환합니다.
   * "₩50,000원" 같은 문자열도 처리 가능합니다.
   *
   * @param {number|string} v - 가격 값
   * @returns {string} "50,000원" 형태의 문자열
   *
   * @example
   * fmt(50000) // → "50,000원"
   * fmt("₩50,000") // → "50,000원"
   */
  const fmt = (v) =>
    (typeof v === "number" ? v : Number(String(v).replace(/[^\d]/g, "")) || 0).toLocaleString() + "원";

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wl-header">
          <h1 className="wl-title">
            나의 위시리스트 <span className="heart">❤</span>
            <span className="count">{count}</span>
          </h1>

          <div className="wl-actions">
            <Link to="/" className="btn ghost lg">계속 쇼핑하기</Link>
            {count > 0 && (
              <button className="btn danger lg" onClick={clearAll}>전체 삭제</button>
            )}
          </div>
        </div>

        {count === 0 ? (
          <div className="wl-empty">
            <p>위시에 담긴 상품이 없습니다.</p>
            <Link to="/" className="btn primary lg">홈으로</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map((p) => (
              <div
                className="wish-card"
                key={p.id}
                role="link"
                onClick={() => goDetail(p)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") goDetail(p); }}
              >
                <div className="thumb">
                  <img
                    src={
                      /^https?:\/\//i.test(p.image)
                        ? p.image
                        : `${process.env.PUBLIC_URL}/${String(p.image || "")
                            .replace(/^\.?\/*/, "")}`
                    }
                    alt={p.name || "product"}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
                    }}
                  />
                  <button
                    className="remove"
                    onClick={(e) => { e.stopPropagation(); removeOne(p.id); }}
                  >
                    삭제
                  </button>
                </div>

                <div className="info">
                  {p.brand && <div className="brand">{p.brand}</div>}
                  <div className="name" title={p.name}>{p.name}</div>
                  <div className="price">
                    {p.originalPrice && <span className="original">{fmt(p.originalPrice)}</span>}
                    <span className="current">{fmt(p.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
